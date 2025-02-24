import { DatabaseConnection } from "../src/config/db";


//this is unit test the database connection
describe("DB Connection ",()=>{
    it("Connect to Database SuccesFully", async()=>{
        const isConnect = await DatabaseConnection();
        expect(isConnect).toBe(true)
    })

      it(" fail to connect  to the database ", async () => {
        process.env.DATABASE_URL = "postgres://johndoe:pw@localhost:5432/db";
        const isConnect = await DatabaseConnection();
        expect(isConnect).toBe(false);
      });
})

