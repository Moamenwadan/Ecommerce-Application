import { FilterQuery, Model, UpdateQuery } from 'mongoose';

export type findOneArg<TDocument> = {
  filter?: FilterQuery<TDocument>;
  populate?: any;
  select?: string;
};
export type Ipaginate = { page: number | undefined };
export type findArgs<TDocument> = findOneArg<TDocument> & {
  paginate?: Ipaginate;
  sort?: any;
};
export type updateArg<TDocument> = {
  filter?: FilterQuery<TDocument>;
  update: UpdateQuery<TDocument>;
  populate?: any;
  select?: string;
};

export abstract class AbstractRepositry<TDocument> {
  protected constructor(private readonly model: Model<TDocument>) {}

  async findAll({
    filter = {},
    select,
    populate,
    paginate,
    sort,
  }: findArgs<TDocument>): Promise<TDocument[] | any> {
    let query = this.model.find(filter);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    if (sort) query = query.sort(sort);
    const page = paginate?.page ? paginate?.page : 1;
    console.log(page);
    let limit = 4;
    let skip = (page! - 1) * limit;
    const totalNumberOfCategory = await query.model.countDocuments(
      query.getQuery(),
    );
    const data = await query.skip(skip).limit(limit).exec();
    return {
      totalNumberOfCategory, // عدد المنتجات الموجوده فى الداتا بيسكلها
      totalPages: Math.ceil(totalNumberOfCategory / limit), //عدد اللصفح اللى هيتعرض فيها المنتجات
      pageSize: data.length, // هو عدد الكاتيجورى المعروضه فى الصفحه الواحده
      pageNumber: page, // رقم الصفحه اللى انا فيها
      data,
    };

    // const data = await query.exec();
    // return { data };
  }

  async findOne({
    filter = {},
    populate,
    select,
  }: findOneArg<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOne(filter);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    const data = query.exec();
    return data;
    //  return query.exec()
  }
  async create(document: Partial<TDocument>) {
    let doc = await this.model.create({ ...document });
    return doc;
  }

  async update({
    filter = {},
    update,
    populate,
    select,
  }: updateArg<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return query.exec();
  }
  async delete(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOneAndDelete(filter);
    return query.exec();
  }
}
