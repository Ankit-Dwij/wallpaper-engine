import { Schema, Document, Model } from 'mongoose';

export interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
  randomize?: boolean; // Add this flag for randomization
}

const paginate = <T extends Document, U extends Model<U>>(schema: Schema<T>): void => {
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    let sort: string = '';

    // Determine sorting criteria
    if (options.sortBy) {
      const sortingCriteria: any = [];
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    // Determine projection criteria
    let project: string = '';
    if (options.projectBy) {
      const projectionCriteria: string[] = [];
      options.projectBy.split(',').forEach((projectOption) => {
        const [key, include] = projectOption.split(':');
        projectionCriteria.push((include === 'hide' ? '-' : '') + key);
      });
      project = projectionCriteria.join(' ');
    } else {
      project = '-createdAt -updatedAt';
    }

    // Determine pagination options
    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    // Count total documents matching filter
    const countPromise = this.countDocuments(filter).exec();

    // Query documents based on filter and pagination options
    let docsPromise: any;

    if (options.randomize) {
      // Randomize using $sample for MongoDB
      docsPromise = this.aggregate([{ $match: filter }, { $sample: { size: limit } }]).exec();
    } else {
      // Regular sorting and pagination
      docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(project).exec();
    }

    // Perform population if specified
    if (options.populate) {
      options.populate.split(',').forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a: string, b: string) => ({ path: b, populate: a }))
        );
      });
    }

    // Wait for count and query promises to resolve
    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);

      // Prepare and return QueryResult object
      const result: QueryResult = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return result;
    });
  });
};

export default paginate;
