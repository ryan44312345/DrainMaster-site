import { Link } from "react-router";

export default function Login() {
    return (
        <>
        <div className="flex items-center justify-center h-screen w-screen">
            
        <div className="bg-[#001A24]">  
            <h1 className="text-white text-center">login</h1>
            <p className="text-white font-sans">
                ainda não possui uma conta? 
                <Link to="/cadastro" className="ml-3 text-blue-400">Cadastrar</Link>
            </p>
        </div>
            
        </div>
            
        </>
    )
}