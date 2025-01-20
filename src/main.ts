import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import BancoMysql from './db/banco-mysql'
import BancoMongo from './db/banco-mongo'

const app = express()
app.use(express.json())
app.use(cors())


app.get("/produtos", async (req, res) => {
    try {
        const banco = new BancoMongo()
        await banco.criarConexao()
        const result = await banco.listar()
        await banco.finalizarConexao()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send("Server ERROR")
    }
})
app.post("/produtos", async (req, res) => {
    try {
        const {id,nome,descricao,preco,imagem} = req.body
        const banco = new BancoMongo()
        await banco.criarConexao()
        const produto = {id,nome,descricao,preco,imagem}
        const result = await banco.inserir(produto)
        await banco.finalizarConexao()
        res.send(result) 
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//DELETAR
app.delete("/produtos/:id",async(req,res)=>{
    try{
        const banco = new BancoMongo()
        await banco.criarConexao()
        const result = await banco.excluir(req.params.id)
        await banco.finalizarConexao()
        res.status(200).send("Produto excluido com sucesso id: "+req.params.id)
    }
    catch(e){
        console.log(e)
        res.status(500).send("Erro ao excluir")
    }
    
})

//ALTERAR
app.put("/produtos/:id",async(req,res)=>{
    const {id,nome,descricao,preco,imagem} = req.body
    console.log(req.params.id)
    const query = "UPDATE produtos SET nome=?, descricao=?, preco=?, imagem=? WHERE id = ?"
    const parametros = [nome,descricao,preco,imagem,req.params.id]

    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.consultar(query,parametros)
    await banco.finalizarConexao()
    res.send("Produto atualizado com sucesso id: "+req.params.id)
})

app.listen(8000, () => {
    console.log("Iniciei o servidor")
})
