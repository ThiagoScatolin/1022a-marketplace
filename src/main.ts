import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())
app.get("/produtos", async(req,res)=>{
    // OK -> 0 - Criar o banco de dados e iniciar o servidor
    // 1 - Criar a conexão com o banco
try{
    const conection = await mysql.createConnection({
        host:process.env.dbhost?process.env.dbhost:"localhost",
        user:process.env.dbuser?process.env.dbuser:"root",
        password:process.env.dbpassword?process.env.dbpassword:"",
        database:process.env.dbname?process.env.dbname:"banco1022a",
        port:process.env.dbport?parseInt(process.env.dbport):3306
    })
    // 2 - Realizar um consulta na tabela
    const [result, fields] = await conection.query("SELECT * from produtos")
    // 3 - Devolver dados para quem pediu
    await conection.end()
    res.send(result)
}catch(e){
    res.status(500).send("Server ERROR")
}
})

//Abrir uma porta do servidor express
app.listen(8000,()=>{
    console.log("Inicie o Servidor")
})
