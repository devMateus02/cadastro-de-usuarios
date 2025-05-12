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
   const [message, setMessage] = useState('');
   const [error, setError] = useState('');


      async function getUsers() {
          const usersFromApi = await Api.get('/usuarios')

        setUsers(usersFromApi.data)
      }


async function postUsers() {
  const name = inputName.current.value.trim();
  const age = inputAge.current.value.trim();
  const email = inputEmail.current.value.trim();

function isValidEmail(email) {
  // Regex simples para validar e-mails
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

if (!name || !age || !email) {
  setError('Preencha todos os campos.');
  setMessage('');
  return;
}

if (!isValidEmail(email)) {
  setError('Email inválido.');
  setMessage('');
  return;
}


  try {
    await Api.post('/usuarios', { name, age, email });

    setMessage('Usuário cadastrado com sucesso!');
    setError('');
    getUsers();

    // limpar os inputs
    inputName.current.value = '';
    inputAge.current.value = '';
    inputEmail.current.value = '';
  } catch (err) {
    if (err.response && err.response.status === 400) {
      setError(err.response.data.error); // e-mail duplicado
    } else {
      setError('Erro ao cadastrar usuário.');
    }
    setMessage('');
  }


 
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
                <input type="text" name='name' placeholder='Nome' ref={inputName} required/>

                <input type="text" name ='idade' placeholder='Idade' ref={inputAge} required/>

                <input type='email' name='email' placeholder='Email' ref={inputEmail} required/>

                 {message && <p className="success">{message}</p>}
                 {error && <p className="error">{error}</p>}

                <button type='button'onClick={postUsers}>Cadastra</button>
        </form>
        {users.map(user => (
          <div className="container-users" key={user._id}>
            <div className="users">
              <p><span>Nome: </span>  {user.name}</p>
              <p><span>Idade: </span> {user.age}</p>
              <p><span>Email: </span> {user.email}</p>
            </div>
            <button className='btn-delete' onClick={() => deleteUser(user._id)}><img src={Bin} alt="botão de excluir" /></button>
          </div>
        ))}


        
      </div>

    </div>
  );
}

export default Home;
