"use client";
import { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import toast from "react-hot-toast";

type Step = "login" | "register";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("login");
  const [countryCode, setCountryCode] = useState("+996");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanInputNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, "");
  const countryClean = countryCode.replace("+", "");
  const actualNumber = cleanInputNumber.startsWith(countryClean)
    ? cleanInputNumber.slice(countryClean.length)
    : cleanInputNumber;
  const fullPhone = countryCode + actualNumber;

  const validateFields = (): boolean => {
    if (!phoneNumber.trim() || !password.trim()) {
      toast.error("Заполните все поля");
      return false;
    }
    if (countryCode === "+996" && actualNumber.length !== 9) {
      toast.error("Номер для Кыргызстана должен содержать 9 цифр (без +996)");
      return false;
    }
    if ((countryCode === "+7" || countryCode === "+77") && actualNumber.length !== 10) {
      toast.error("Номер должен содержать 10 цифр (без +7)");
      return false;
    }
    if (countryCode === "+998" && actualNumber.length !== 9) {
      toast.error("Номер для Узбекистана должен содержать 9 цифр");
      return false;
    }
    if (countryCode === "+992" && actualNumber.length !== 9) {
      toast.error("Номер для Таджикистана должен содержать 9 цифр");
      return false;
    }
    if (password.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!agreed) return toast.error("Примите политику конфиденциальности");
    if (!validateFields()) return;

    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      toast.error("Превышено время ожидания. Проверь подключение к сети.");
    }, 8000);

    try {
      const fakeEmail = `${fullPhone}@phone.local`;
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            phone_number: fullPhone,
            display_name: fullPhone,
          },
        },
      });

      clearTimeout(timeout);

      if (error) {
        if (error.message.includes("already registered") || error.status === 400) {
          toast.error("Этот номер уже зарегистрирован. Переходим ко входу...");
          setStep("login");
        } else {
          toast.error(error.message);
        }
      } else if (data?.session || data?.user) {
        toast.success("Регистрация успешна! Добро пожаловать.");
        onClose();
      }
    } catch {
      clearTimeout(timeout);
      toast.error("Ошибка при выполнении запроса регистрации");
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      toast.error("Превышено время ожидания. Проверь подключение к сети.");
    }, 8000);
    try {
      const fakeEmail = `${fullPhone}@phone.local`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      clearTimeout(timeout);

      if (error) {
        toast.error("Неверный номер или пароль");
      } else if (data?.session || data?.user) {
        toast.success("С возвращением!");
        onClose();
      }
    } catch {
      clearTimeout(timeout);
      toast.error("Ошибка при выполнении запроса ко входу");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (step === "register") handleRegister();
    else handleLogin();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[420px] rounded-[24px] p-6 sm:p-8 relative shadow-2xl max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">

        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" onClick={onClose} />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block"
        >
          <X size={22} />
        </button>

        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Добро пожаловать</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {step === "register"
              ? "Зарегистрируйтесь для использования всех функций"
              : "Введите данные для входа в аккаунт"}
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-[#F3F6FF] rounded-xl px-2.5 sm:px-3 py-3.5 outline-none font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400 transition cursor-pointer text-sm"
            >
              <option value="+996">🇰🇬 +996</option>
              <option value="+7">🇷🇺 +7</option>
              <option value="+77">🇰🇿 +7</option>
              <option value="+998">🇺🇿 +998</option>
              <option value="+992">🇹🇯 +992</option>
              <option value="+375">🇧🇾 +375</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s\-\(\)\+]/g, ""))}
              placeholder="Номер телефона"
              className="flex-1 px-4 py-3.5 bg-[#F3F6FF] rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3.5 pr-12 bg-[#F3F6FF] rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 transition"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {step === "login" && (
            <div className="text-right">
              <button type="button" className="text-xs sm:text-sm text-gray-500 hover:text-blue-500 transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}

          {step === "register" && (
            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-xs sm:text-sm text-gray-500">
                Я согласен с{" "}
                <button className="text-blue-500 hover:underline">правилами</button>
              </span>
            </label>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#4A90E2] hover:bg-[#3A7FD1] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 shadow-md shadow-blue-50"
          >
            {loading ? "Загрузка..." : step === "register" ? "Зарегистрироваться" : "Войти"}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
            {step === "login" ? (
              <>
                Нет аккаунта?{" "}
                <button onClick={() => setStep("register")} className="text-blue-500 font-semibold hover:underline">
                  Создать
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{" "}
                <button onClick={() => setStep("login")} className="text-blue-500 font-semibold hover:underline">
                  Войти
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}