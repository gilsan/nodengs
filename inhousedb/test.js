
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');

const insertOperation   = async (transaction,data1) => {
    return new Promise((resolve, reject) => {
        try {
            var request = new mssql.Request(transaction);
            request.input('data1'      , mssql.NVarChar(40)   , data1)
            .execute('dbo.insertOperation').then((recordSet) => {
                resolve(recordSet.recordsets);
            }).catch((err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

const updateOperation   = async (transaction,data2) => {
    return new Promise((resolve, reject) => {
        try {
            var request = new mssql.Request(transaction);
            request.input('data2'      , mssql.NVarChar(40)   , data2)
            .execute('dbo.updateOperation').then((recordSet) => {
                resolve(recordSet.recordsets);
            }).catch((err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

const executeProcedure = async (data1, data2) => {
    try {
        // sql connection 
        let dbConn  = new mssql.ConnectionPool(dbConfigMssql);
        await dbConn.connect();
        let transaction = new mssql.Transaction(dbConn);

        console.log (data1, data2);

        await transaction.begin().then(async()=> {
            // tranaciton create
            // begin tran
    
            let result  = await insertOperation(transaction, data1);
            let result2 = await updateOperation(transaction, data2);

            let result1 = await  Promise.all([result, result2]);
            await transaction.commit();
            dbConn.close();

        }).catch(async(err)=> {
            await transaction.rollback();
            dbConn.close();
            throw err;
        });

        return {};
    }
    catch (error) {
        throw(error);
    }
}


executeProcedure('3', '2');