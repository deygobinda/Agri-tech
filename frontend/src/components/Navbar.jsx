import { Link } from "react-router-dom"


function Navbar() {
  return (
    <div className="p-5 flex  justify-between  bg-black text-white">
      <div className="text-2xl font-bold ">FalsalcareAI</div>

      <div className="flex gap-14 ">
        <div className="flex gap-10 text-slate-500  text-xl font-medium">
          <Link to={"/"}>Disease</Link>
          <Link to={"/weather"}>Weather</Link>
        </div>
        <div className="flex gap-5">
          <button className="texl-xl font-medium  bg-slate-400 py-1 text-black px-4 rounded-md">Login</button>
          <button className="texl-xl font-medium  bg-slate-400 py-1 text-black px-4 rounded-md">Singup</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
