import { Link } from "react-router";

export default function Cadastro() {
    function handleSubmit(event) {
        event.preventDefault()
        Navigate("/login")
    }

    return (
        <>
        <style>
        {`
            .fade-in {
                animation: fade-in 0.5s ease-out;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}
        </style>
            <div className="h-screen flex items-center justify-center text-white bg-[#001A24]">
                <div className="w-1/2 max-w-3xl h-1/2 border-2 border-white rounded-xl p-8 fade-in">
                    <h1 className="text-white text-center text-3xl">
                        Cadastro
                    </h1>

                    <p className="text-center">
                        Você já possui uma conta?
                        <Link to="/login" className="ml-3 text-blue-400">
                            Login
                        </Link>
                    </p>

                    <form
                        className="h-full grid grid-rows-5 pt-2"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="ml-2 col-start-2">
                                Nome:
                            </label>
                            <fieldset className="border-2 border-white rounded-md w-3/4 px-3 col-start-3 col-span-2">
                            <legend className="px-2 text-white">
                                Nome
                            </legend>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="text-blue-400 ml-1 rounded-md w-3/4 border-none focus:outline-none"
                                placeholder="John Smith"
                            />
                            </fieldset>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="ml-2 col-start-2">
                                E-mail:
                            </label>
                            <fieldset className="border-2 border-white rounded-md w-3/4 px-3 col-start-3 col-span-2">
                            <legend className="px-2 text-white">
                                E-mail
                            </legend>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="text-blue-400 ml-1 rounded-md w-3/4 border-none focus:outline-none"
                                placeholder="algo@gmail.com"
                            />
                            </fieldset>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="password" className="ml-2 col-start-2">
                                Senha:
                            </label>
                            <fieldset className="border-2 border-white rounded-md w-3/4 px-3 col-start-3 col-span-2">
                            <legend className="px-2 text-white">
                                Senha
                            </legend>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="text-blue-400 ml-1 rounded-md w-3/4 border-none focus:outline-none"
                                placeholder="*****"
                            />
                            </fieldset>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="confirm" className="ml-2 col-start-2">
                                Confirmar Senha:
                            </label>
                            <fieldset className="border-2 border-white rounded-md w-3/4 px-3 col-start-3 col-span-2">
                            <legend className="px-2 text-white">
                                Confirmar Senha
                            </legend>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="text-blue-400 ml-1 rounded-md w-3/4 border-none focus:outline-none"
                                placeholder="*****"
                            />
                            </fieldset>
                        </div>

                        <div className="mx-auto">
                            <button
                                
                                className="text-xl font-sans flex items-center cursor-pointer transition-[transform,background-position] duration-1000 ease-out hover:scale-150 bg-gradient-to-r from-blue-400 from-50% to-white to-50% bg-[length:200%_100%] bg-right bg-clip-text text-transparent hover:bg-left"


                            >
                                
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}