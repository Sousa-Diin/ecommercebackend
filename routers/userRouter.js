import { Router } from 'express';
import UserRepository from '../repository/BaseRepository.js';


const router = Router();

router.get('/', async (req, res) => {
  const result = await new UserRepository('users').getAll([
    'id',
    'name',
    'surname',
    'email'
  ]);
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const result = await new UserRepository('users').getById(id,[
    'id',
    'name',
    'surname',
    'email'
  ]);
  res.status(200).send(result);
});

router.post('/', async (req, res) => {
  const { body } = req;
  const columnsArray = ['name', 'surname', 'email']; // array base;

  /*  Verifica se o obj da req esta na ordem certa, usando o array base 
      e retornando um array [] com os elememto na posição correta com a função "reduce" 
  */
  const valuesArray = columnsArray.reduce((acc, columnName) =>{
    acc.push(body[columnName]);
    return acc;
  }, []);
  await new UserRepository('users').insertOne(['name','surname', 'email'], valuesArray);
  res.status(200).send('row add');
});

export default router;