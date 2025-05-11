import { useEffect , useState} from 'react'
import { useRef } from 'react';
import Api from '../../services/api'
import Bin from '../../assets/trash.png'
import './style.css'

function Home() {
   const [users, setUsers] = useState([])

   const inputName = useRef() 
   const inputAge = useRef() 
   const inputEmail = useRef() 

      async function getUsers() {
          const usersFromApi = await Api.get('/usuarios')

        setUsers(usersFromApi.data)
      }

      async function postUsers() {
        await Api.post('/usuarios', {
          name: inputName.current.value, 
          age: inputAge.current.value,
          email: inputEmail.current.value
        })

        getUsers()
      }

      async function deleteUser(id) {
        await Api.delete(`/usuarios/${id}`)

       getUsers()

        
      }

     useEffect(() => {
      getUsers()
     },[])


  const bgRef = useRef(null);
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.2) * 5; // 30px máximo para o efeito
    const y = (e.clientY / innerHeight - 0.2) * 5;

    if (bgRef.current) {
      bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    }
  };

  return (
    <div className="parallax-container" onMouseMove={handleMouseMove}>
      <div className="parallax-bg" ref={bgRef}></div>
      <div className="content">
        
          <form>
               <h1>cadastrar usuário</h1>
                <input type="text" name='name' placeholder='Nome' ref={inputName}/>

                <input type="text" name ='idade' placeholder='Idade' ref={inputAge}/>

                <input type='email' name='email' placeholder='Email' ref={inputEmail}/>

                <button type='button'onClick={postUsers}>Cadastra</button>
        </form>
        {users.map(user => (
          <div className="container-users" key={user.id}>
            <div className="users">
              <p><span>Nome: </span>  {user.name}</p>
              <p><span>Idade: </span> {user.age}</p>
              <p><span>Email: </span> {user.email}</p>
            </div>
            <button className='btn-delete' onClick={() => deleteUser(user.id)}><img src={Bin} alt="botão de excluir" /></button>
          </div>
        ))}


        
      </div>

    </div>
  );
}

export default Home;
