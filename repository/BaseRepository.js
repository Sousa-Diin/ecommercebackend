import pool from "./db.js";

class BaseRepository {
  constructor(table){
    this.table = table;
  }
  async getAll(columnsArray){
    try {
      const results = (await pool.query(`SELECT ${columnsArray.join()} FROM ${this.table}`)).rows;
      return results;   
    } catch (error) {
      throw error;
    }
  }

  async getById(id, columnsArray){
    try {
      // id = $1 cria uma flags (array) que aponta para o elemeto id 
      const queryText = `SELECT ${columnsArray.join()} FROM ${this.table} WHERE id = $1`;
      const result = (await pool.query(queryText, [id])).rows[0]; // O pool gerencia o array criado e obtem o elemeto no indice apontado
      return result;
    } catch (error) {
      throw error;
    }
  }

  async insertOne(columnsArray, valuesArray){
    const client = await pool.connect(); // inicia a conexao
    try {
      /* Cria um array vazio do tamanho do columnsArray depois usa os indices apartir do Array.from
         e mapeia cada um criando as flags da consulta dinamicamente ($1, $2, $3, ...)
      */
      let flagsArray = Array.from((new Array(columnsArray.length)).keys()).map( el => `$${el+1}`);

      /*  O join() é usado para para simplificar a escrita das coluna do DB ex: (nome, surname, email) 
          o join monta a estrutura exata para consulta, pegando cada elemento acrescido de uma virgula ficando semelhante a de cima 
          Ex: columnsArray.join()      -> (name, suurname, email)
              VALUES flagsArray.join() -> ($1,$2, $3, $4, ...)
      */
      const queryText = `INSERT INTO ${this.table} (${columnsArray.join()}) VALUES (${flagsArray.join()})`;
      await client.query('BEGIN TRANSACTION'); // Responsavel por monitorar as alteracoes 
      await client.query(queryText, valuesArray);
      await client.query('COMMIT'); // Valida as alteracoes current
    } catch (error) {
      await client.query('ROLLBACK'); //Responsavél para desfazer as alteracoes anteriores
      throw error;
    } finally {
      client.release(); // termina a conexao
    }
  }

}


export default BaseRepository;