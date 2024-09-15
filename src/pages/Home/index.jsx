import { useEffect, useState, useRef } from 'react'
import './style.css'
import api from '../../services/api'
import { FaTrash, FaEdit } from "react-icons/fa";

function Home() {

  const [users, setUsers] = useState([])
  const [editarUser, setEditarUser] = useState(null)

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)

  }

  async function creatUsers() {

    if (!inputName.current.value.trim() ||
      !inputAge.current.value.trim() ||
      (!editUser && !inputEmail.current.value.trim())
    ) {
      alert('Por favor, preencha todos os campos.')
      return;
    }

    if (editarUser) {
      await api.put(`/usuarios/${editarUser}`, {
        name: inputName.current.value,
        age: inputAge.current.value,
      })
      setEditarUser(null);
    } else {
      await api.post('/usuarios', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })
    }
    getUsers()

    inputName.current.value = ''
    inputAge.current.value = ''
    inputEmail.current.value = ''
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)

    getUsers()

  }

  function editUser(user) {
    inputName.current.value = user.name
    inputAge.current.value = user.age
    setEditarUser(user.id)  // Define o ID do usuário que está sendo editado
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (

    <div className='container'>
      <form>
        <h1>{editarUser ? 'Alterar Usuário' : 'Cadastro de Usuário'}</h1>
        <input placeholder='Nome' name='nome' type='text' ref={inputName} />
        <input placeholder='Idade' name='idade' type='number' ref={inputAge} />
        {!editarUser && (
          <input placeholder='E-mail' name='email' type='email' ref={inputEmail} />
        )}

        <button type='button' onClick={creatUsers}>
          {editarUser ? 'Alterar Cadastro' : 'Cadastrar'}
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <div className='conterinerButton'>
            <button onClick={() => editUser(user)}>
              <FaEdit />
            </button>
            <button onClick={() => deleteUsers(user.id)}>
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

    </div>

  )
}

export default Home
