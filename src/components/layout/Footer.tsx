"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();


 

  const handleProtectedAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    } else {
      router.push("/profile/create");
    }
  };

  return (
    <>
      <footer className="lg:hidden bg-white mt-auto mb-16">
        <div className="max-w-[600px] mx-auto px-6 py-8 flex flex-col items-center text-center gap-6">

          <h2 className="text-[#29ABE2] font-bold text-5xl">Jerdesh - Moscow</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Скачайте наше мобильное приложение и пользуйтесь всеми функциями прямо из телефона
          </p>

          <div className="flex flex-row gap-3 justify-center">
            <a href="#" className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors">
              <Image src="/playstore.svg" alt="Google Play" width={28} height={28} />
              <div className="text-left">
                <p className="text-[9px] text-gray-400 leading-none uppercase tracking-wide">СКАЧАЙТЕ</p>
                <p className="text-base font-semibold leading-tight">Google Play</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors">
              <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[9px] text-gray-400 leading-none uppercase tracking-wide">СКАЧАЙТЕ</p>
                <p className="text-base font-semibold leading-tight">App Store</p>
              </div>
            </a>
          </div>

          <div className="w-full border-t border-gray-200" />

          <div className="w-full">
            <p className="text-gray-500 text-sm mb-3 text-left">Наши социальные сети:</p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
                Жердеш в Telegram
              </a>
              <a href="#" className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
                <Image src="/instagram.svg" alt="Instagram" width={20} height={20} />
                Жердеш в Instagram
              </a>
              <a href="#" className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
                JerdeshMoskva.ru сайт
              </a>
            </div>
          </div>

          <div className="w-full border-t border-gray-200" />

          <div className="flex items-center gap-6 text-white/80 text-sm">
  <p className="hover:text-white transition-colors cursor-pointer">Контакты</p>
  <p className="hover:text-white transition-colors cursor-pointer">О проекте</p>
  <p className="hover:text-white transition-colors cursor-pointer">Политика конфиденциальности</p>
</div>

          <div className="text-sm text-gray-400 text-center leading-relaxed">
            <p>© 2025 LLC. Все права защищены.</p>
            <p>Создание сайта стажёр PROlab Agency.</p>
          </div>

        </div>
      </footer>

      <footer className="hidden lg:block bg-[#29ABE2] mt-auto">
        <div className="max-w-[1800px] mx-auto px-10 py-10">
          <div className="flex flex-row justify-between gap-8 items-start">

            {/* Левая часть */}
            <div className="flex flex-col gap-6">
              <h2 className="text-white font-bold text-4xl tracking-tight">Jerdesh-Moskva</h2>

              {/* Подписка */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Получить объявление по подписке в чат-бота"
                  className="bg-white text-gray-500 text-base px-5 py-3 rounded-full outline-none w-96 placeholder-gray-400"
                />
                <button className="bg-[#29ABE2] border-2 border-white text-white text-base font-medium px-6 py-3 rounded-full hover:bg-white hover:text-[#29ABE2] transition-colors whitespace-nowrap">
                  Активировать
                </button>
              </div>

              
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 text-base font-medium px-5 py-3 rounded-full transition-colors">
                  Жердеш в Telegram
                </a>
                <a href="#" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 text-base font-medium px-5 py-3 rounded-full transition-colors">
                  <Image src="/instagram.svg" alt="Instagram" width={22} height={22} />
                  Жердеш в Instagram
                </a>
                <a href="#" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 text-base font-medium px-5 py-3 rounded-full transition-colors">
                  JerdeshMoskva.ru сайт
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-end shrink-0">
              <p className="text-white font-bold text-xl">Наши приложения:</p>
              <a href="#" className="flex items-center gap-4 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-colors w-56">
                <Image src="/playstore.svg" alt="Google Play" width={32} height={32} />
                <div>
                  <p className="text-[10px] text-gray-400 leading-none uppercase tracking-wide">СКАЧАЙТЕ</p>
                  <p className="text-lg font-semibold leading-tight">Google Play</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-4 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-colors w-56">
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none uppercase tracking-wide">СКАЧАЙТЕ</p>
                  <p className="text-lg font-semibold leading-tight">App Store</p>
                </div>
              </a>
            </div>

          </div>
        </div>

        <div className="border-t border-white/30" />

        {/* Нижняя полоса */}
        <div className="max-w-[1800px] mx-auto px-10 py-4">
          <div className="flex items-center justify-between">
            <div className="shrink-0">
            </div>
            <button
              onClick={handleProtectedAction}
              className="border-2 border-white text-white text-base font-medium px-6 py-2.5 rounded-full hover:bg-white hover:text-[#29ABE2] transition-colors"
            >
              + Опубликовать объявление
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 pb-1">
            <p className="text-white/80 text-sm">© 2025 LLC. Все права защищены.</p>
            <div className="flex items-center gap-6 text-white/80 text-sm">
  <p className="hover:text-white transition-colors cursor-pointer">Контакты</p>
  <p className="hover:text-white transition-colors cursor-pointer">О проекте</p>
  <p className="hover:text-white transition-colors cursor-pointer">Политика конфиденциальности</p>
</div>
            <p className="text-white/80 text-sm">Создание сайта стажёр PROlab Agency.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 