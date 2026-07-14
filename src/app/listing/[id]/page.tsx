import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import ListingClient from "@/src/app/listing/ListingClient"; 
import GalleryComponent from "@/src/app/listing/GalleryComponent"; 
import { 
  MapPin, Calendar, Eye, 
  Phone, Send, Share2, MessageCircle,
  User, CircleDollarSign
} from "lucide-react";

const CATEGORIES_MAP: Record<string, string> = {
  zhilye: "Жильё",
  vacancy: "Вакансии",
  taxi: "Такси",
  prodaju: "Продажа",
  uslugi: "Услуги",
  obuchenie: "Ообучение"
};

export default async function ListingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const queryParam = parseInt(id, 10);
  const supabase = await createSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', queryParam) 
    .single();

  if (postError || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-3xl shadow-sm border max-w-md mx-4">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Объявление не найдено</h1>
          <p className="text-gray-500 mb-4 text-sm leading-relaxed">
            {postError ? `Ошибка сервера: ${postError.message}` : 'Такого объявления не существует.'}
          </p>
          <Link href="/" className="inline-block bg-[#4A90E2] hover:bg-[#3A7FD1] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  let authorProfile = null;
  if (post.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, phone_number, telegram_username, whatsapp_number')
      .eq('id', post.user_id) 
      .maybeSingle();
    
    authorProfile = profileData;
  }

  const baseImage = post.image && post.image !== "null" && post.image !== "" 
    ? post.image 
    : "/placeholder.png";

  const postImages: string[] = Array(4).fill(baseImage);

  const authorName =  post.user  ;
  const authorPhone =  post.phone ;
  const telegram = authorProfile?.telegram_username || post.telegram || '';
  const whatsapp = authorProfile?.whatsapp_number || post.whatsapp || '';

  const displayCategory = CATEGORIES_MAP[post.categoryId] || post.categoryId || 'Общая';

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Хлебные крошки */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link href="/" className="hover:text-blue-500 transition-colors">Главная</Link> / 
        <span>Категория {displayCategory}</span> / 
        <span className="text-gray-900 truncate max-w-[200px]">{post.title}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        
        {/* Мета-информация */}
        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400" /> 
            {post.city || post.metro || "Москва"}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={16} className="text-gray-400" /> 
            {post.views || 0} просмотров
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-400" /> 
            {post.created_at ? new Date(post.created_at).toLocaleDateString("ru-RU") : "Дата неизвестна"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Галерея картинок */}
          <div className="lg:col-span-5">
            <GalleryComponent key={post.id} images={postImages} title={post.title} />
          </div>

          {/* Информационный блок */}
          <div className="lg:col-span-7">
            <div className="bg-[#F3F6FF] rounded-[32px] p-6 md:p-8 border border-blue-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div>
                  <p className="text-blue-500 text-[15px] font-medium flex items-center gap-1 mb-1">
                    <User size={16} /> Автор
                  </p>
                    <p className="font-semibold text-gray-800 truncate">{authorName}</p>
                </div>
                <div>
                  <p className="text-blue-500 text-[15px] font-medium flex items-center gap-1 mb-1">
                    <Phone size={16} /> Телефон
                  </p>
                  <p className="font-semibold text-gray-800">{authorPhone || "Не указан"}</p>
                </div>
                <div>
                  <p className="text-blue-500 text-[15px] font-medium flex items-center gap-1 mb-1">
                    <CircleDollarSign size={16} /> Стоимость
                  </p>
                  <p className="font-semibold text-gray-800 text-xl text-blue-600">
                    {post.price ? `${post.price.toLocaleString("ru-RU")} ₽` : "Договорная"}
                  </p>
                </div>
              </div>

              {/* Описание */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold mb-3 text-lg">Описание</h3>
                <p className="text-gray-600 text-[16px] leading-relaxed whitespace-pre-wrap">
                  {post.text || post.description || "Описание отсутствует."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {authorPhone && (
                  <a href={`tel:${authorPhone}`} className="bg-[#38A1F3] text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold hover:bg-blue-600 transition shadow-sm">
                    <Phone size={18}/> Позвонить
                  </a>
                )}
                
                {telegram && (
                  <a 
                    href={`https://t.me/${telegram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-blue-200 bg-white text-blue-500 px-6 py-3 rounded-full flex items-center gap-2 font-medium hover:bg-blue-50 transition shadow-sm"
                  >
                    <Send size={18}/> Telegram
                  </a>
                )}

                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-green-200 bg-white text-green-500 px-6 py-3 rounded-full flex items-center gap-2 font-medium hover:bg-green-50 transition shadow-sm"
                  >
                    <MessageCircle size={18}/> WhatsApp
                  </a>
                )}
                
                <button className="bg-gray-200 text-gray-600 p-3 rounded-full hover:bg-gray-300 transition" title="Поделиться">
                  <Share2 size={18}/>
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-2xl text-sm text-gray-500 italic">
              Проверяйте перед оплатой. Будьте внимательны.
              Этот сайт не несет ответственности за достоверность публикуемых объявлений. Избегайте мошенничества.      
            </div>
          </div>
        </div>

        {/* Клиентская часть: Комментарии и Авторизация */}
        <div className="mt-12 max-w-4xl">
          <ListingClient postId={post.id} />
        </div>
      </main>
    </div>
  );
}