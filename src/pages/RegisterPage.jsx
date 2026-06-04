import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { ShieldCheck, User } from "lucide-react";

const RegisterPage = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      navigate('/');
    }
  }, [initialized, keycloak, navigate]);

  const handleRegister = () => {
    keycloak.register();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      <div className="relative w-full max-w-md rounded-3xl border border-green-700/30 bg-slate-900/90 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/30 mb-4">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Register with Keycloak</h1>
          <p className="mt-2 text-sm text-slate-300">Create your account through Keycloak identity management.</p>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-slate-400">Keycloak handles registration and user profile management. Click the button below to create an account or sign-in if you already have one.</p>
          <button
            type="button"
            onClick={handleRegister}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition hover:scale-[1.01]"
          >
            <ShieldCheck className="w-5 h-5" />
            Register with Keycloak
          </button>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 text-sm text-slate-300">
            If registration is disabled in Keycloak, use the login flow to authenticate instead.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
