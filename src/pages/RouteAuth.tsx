import React, { useState } from "react";
import  Login from "../features/auth/login/Login";
import Register from "../features/auth/register/Register";


export default function AuthPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        
    
        <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl lg:block">
            Route Posts
          </h1>
          <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
              About Route Academy
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's Leading IT Training Center Since 2012
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">2012</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Founded
                </p>
              </div>
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">40K+</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Graduates
                </p>
              </div>
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">50+</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Partner Companies
                </p>
              </div>
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">5</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Branches
                </p>
              </div>
              <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                <p className="text-base font-extrabold text-[#00298d]">20</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Diplomas Available
                </p>
              </div>
            </div> 
          </div>
        </section>

     
        <section className="order-1 w-full max-w-[430px] lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
            
     
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>
              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Connect with friends and the world around you on Route Posts.
              </p>
            </div>

          
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`rounded-lg py-2 text-sm font-extrabold transition ${
                  activeTab === "login"
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`rounded-lg py-2 text-sm font-extrabold transition ${
                  activeTab === "register"
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Register
              </button>
            </div>

          
            <h2 className="text-2xl font-extrabold text-slate-900">
              {activeTab === "login" ? "Log in to Route Posts" : "Create an account"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "login"
                ? "Log in and continue your social journey."
                : "Join Route Posts and connect with friends."}
            </p>

            {/* Conditional Rendering */}
            {activeTab === "login" ? (<Login></Login>) : (<Register/>)}

          </div>
        </section>

      </div>
    </div>
  );
}