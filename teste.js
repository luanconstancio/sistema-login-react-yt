import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import axios from 'axios';
import { Enviroment } from '../../../environment';

// Chave de criptografia
const secretKey = "sua_chave_de_criptografia";

// IV (Initialization Vector) fixo
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

// Interface que define a estrutura do objeto de autenticação
interface IAuth {
  acessToken: string;
  idoperador: string;
  message: string;
  nomeoperador: string;
  first_access: string;
}

// Função para criptografar dados usando a chave e o IV
const encrypt = (data: string): string => {
  // Derivação da chave a partir do IV usando o algoritmo PBKDF2
  const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 });
  // Criptografa os dados usando o algoritmo AES e o IV
  const encryptedData = CryptoJS.AES.encrypt(data, derivedKey, { iv }).toString();
  return encryptedData;
};

// Função para descriptografar dados usando a chave e o IV
const decrypt = (encryptedData: string): string => {
  // Derivação da chave a partir do IV usando o algoritmo PBKDF2
  const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 });
  // Descriptografa os dados usando o algoritmo AES e o IV
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, { iv });
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

// Duração do cookie em dias
const COOKIE_EXPIRATION_DAYS = Enviroment.DIAS_EXPIRACAO;
const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';


// Criando uma instância do Axios para realizar as chamadas à API
const Api = axios.create({
  baseURL: Enviroment.URL_BASE_AUTH,

});


// Função de autenticação
const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  try {
    // Concatena o email e a senha em uma única string
    //const concatenatedData = ${email}:${password}; // Use a senha original, não o hash
    const credetion = btoa(${email}:${password});
    // Criptografa a string concatenada
    //const encryptedData = encrypt(concatenatedData);

    // Faz uma requisição de autenticação usando o objeto Api importado
    const { data } = await Api.get("/api/auth/login", { headers: {
      Authorization: "Basic " + credetion 
      } });

    if (data) {
      const expires = new Date();
      expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);
      // Retorna os dados de autenticação
      Cookies.set(COOKIE_KEY__MESSAGE, data.message, { expires });
      return data;
    }

    // Caso não haja dados de autenticação, retorna um novo erro
    return new Error("Erro no login.");
  } catch (error) {
    console.log(error)
    console.error(error);
    // Retorna um erro personalizado com base no erro original
    return new Error(
      (error as { message: string }).message || "Erro no login."
    );
  }
};

// Exporta um objeto contendo a função de autenticação
export const AuthService = {
  auth,
};