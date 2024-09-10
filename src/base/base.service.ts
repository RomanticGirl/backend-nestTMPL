import { DataSource, EntityManager, FindOptionsOrder, FindOptionsRelationByString, ObjectLiteral } from 'typeorm';
import { QueryFindOptions } from './dto/QueryFindOptions';
import { SafeHttp, SafeLog } from '../decorators';
import { Injectable } from '@nestjs/common';

type callbackTransaction<TypeTransaction> = (manager: EntityManager) => Promise<TypeTransaction>

export class BaseService {
    protected readonly OFFSET = 10 as const;
    protected readonly MAX_OFFSET = 100 as const;
    protected LOAD_RELATIONS = [];

    constructor(
        protected dataSource: DataSource,
    ) {
    }

    async wrapperTransaction<TypeTransaction = void>(cb: callbackTransaction<TypeTransaction>): Promise<TypeTransaction> {
        try {
            return await this.dataSource.transaction<TypeTransaction>(async (manager): Promise<TypeTransaction> => {
                return await cb(manager);
            });
        } catch (e) {
            console.error('wrapperTransaction', e.message);
            throw new Error(e.message);
        }
    }


    @SafeLog()
    protected getOffset(offset: string) {
        const currentOffset = parseInt(offset);
        return currentOffset <= this.MAX_OFFSET ? currentOffset : this.OFFSET;
    }

    @SafeLog()
    protected getSkip(page: string) {
        const currentPage = parseInt(page);
        return currentPage ? currentPage - 1 : 0;
    }

    @SafeLog()
    protected getOffsetAndSkip(query: any) {
        const take = this.getOffset(query.offset);
        return {
            take, skip: this.getSkip(query.page) * take,
        };
    }

    getWhere(query: QueryFindOptions): QueryFindOptions {
        // console.error('Метод должен быть override');
        return query;
    }

    getOrder(): FindOptionsOrder<any> {
        // @ts-ignore
        const order: FindOptionsOrder = { id: 'DESC' };
        return order;
    }

    @SafeLog()
    protected getFindOptions(query: QueryFindOptions) {
        let where = this.getWhere(query);
        let order = this.getOrder();
        const offsetAndSkip = this.getOffsetAndSkip(query);
        return { where, ...offsetAndSkip, order };
    }

    protected setLoadRelations(...args: FindOptionsRelationByString) {
        if (args.length) this.LOAD_RELATIONS.push(...args);
    }
}

@Injectable()
export class BaseServiceCRUD extends BaseService {
    protected readonly OFFSET = 10 as const;
    protected readonly MAX_OFFSET = 100 as const;

    constructor(
        dataSource: DataSource,
    ) {
        super(dataSource)
    }

    @SafeHttp('Ошибка создания записи')
    async createItem(schema: string, tableName: string, data: any, columns: string[] = null): Promise<ObjectLiteral> {
        const res = await this.wrapperTransaction(async (manager) => {
            return await manager.createQueryBuilder()
                .insert()
                .into(`"${schema}.${tableName}"`, columns)
                .values(data)
                .execute();
        });
        return res.identifiers[0];
    }


    @SafeHttp('Ошибка обновления записи')
    async updateItem(schema: string, tableName: string, id: number, data: any) {
        await this.wrapperTransaction(async (manager) => {
            await manager.createQueryBuilder()
                .update(`"${schema}.${tableName}"`, {
                    ...data,
                })
                .where('id=:id', { id })
                .execute();
        });
    }

    @SafeHttp('Ошибка чтения записей')
    async findList(schema: string, tableName: string, query: QueryFindOptions = {}): Promise<{
        count: number,
        offset: number,
        items: any[]
    }> {
        const { take, skip, where } = this.getFindOptions(query);

        const queryBuilder = this.dataSource
            .createQueryBuilder()
            .select(`"${schema}.${tableName}".*`)
            .from(`${schema}.${tableName}`, null);


        const items: any[] = await queryBuilder
            .where(where)
            .skip(skip)
            .take(take)
            .getRawMany();

        const { count } = await this.dataSource
            .createQueryBuilder()
            .select(`count(*)`)
            .from(`${schema}.${tableName}`, null)
            .where(where)
            .getRawOne();
        return {
            count: +count,
            offset: take,
            items,
        };
    }

    async getById(schema: string, tableName: string, id: number) {
        const queryBuilder = this.dataSource
            .createQueryBuilder()
            .select(`"${schema}.${tableName}".*`)
            .from(`${schema}.${tableName}`, null)
            .where('id=:id', { id });

        return await queryBuilder.getRawOne();
    }

    async getSchemas() {
        const queryBuilder = this.dataSource
            .createQueryBuilder()
            .select(`schema_name`)
            .from(`information_schema.schemata`, null)
            .where("schema_name like 's_%'")

        return await queryBuilder.getRawMany();
    }

    async getSchemaFilesType(schema: string) {
        const queryBuilder = await this.dataSource
            .createQueryBuilder()
            .select(`REGEXP_REPLACE(tablename,'__.*','') as file_type`)
            .distinct(true)
            .from(`pg_catalog.pg_tables`, null)
            .where('schemaname = :schema', { schema })
            .getRawMany();


        return queryBuilder.map(el => el = el.file_type);
    }

    async getFilesByType(schema: string, type: string) {
        const queryBuilder = await this.dataSource
            .createQueryBuilder()
            .select(`REGEXP_REPLACE(REPLACE(tablename,'jkh__',''),'__.*','') as file_name`)
            .distinct(true)
            .from(`pg_catalog.pg_tables`, null)
            .where("schemaname = :schema AND tablename like :type", { schema, type: `${type}_%` })
            .getRawMany();

        return queryBuilder.map(el => el = el.file_name);
    }

    async getTablesByType(schema: string, file: string) {
        const queryBuilder = await this.dataSource
            .createQueryBuilder()
            .select(`tablename as table_name`)
            .distinct(true)
            .from(`pg_catalog.pg_tables`, null)
            .where("schemaname = :schema AND tablename like :file", { schema, file: `%${file}%` })
            .getRawMany();

        return queryBuilder.map(el => el = el.table_name);
    }

}