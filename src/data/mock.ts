import {
  Star,
  Briefcase,
  Home,
  Car,
  ShoppingCart,
  Wrench,
  GraduationCap,
  Search,
  type LucideIcon,
} from "lucide-react";

export const CITIES = [
  "По всей Москве",
  "Авиамоторная","Академическая","Александровский сад","Алексеевская",
  "Алма-Атинская","Алтуфьево","Аминьевская","Андроновка","Аникеевка",
  "Аннино","Аэропорт","Бабушкинская","Багратионовская","Баковка",
  "Балтийская","Баррикадная","Бауманская","Белокаменная","Беломорская",
  "Белорусская","Беляево","Бескудниково","Бибирево","Библиотека им.Ленина",
  "Битца","Борисово","Боровицкая","Боровское шоссе","Ботанический сад",
  "Братиславская","Бульвар Дмитрия Донского","Бульвар Рокоссовского",
  "Бунинская аллея","Бутово","Бутырская","ВДНХ","Варшавская",
  "Верхние Котлы","Верхние Лихоборы","Владыкино","Водники","Водный стадион",
  "Войковская","Волгоградский проспект","Волжская","Волоколамская",
  "Волхонка","Воробьёвы горы","Воронцовская","Выставочная","Выхино",
  "Говорово","Гражданская","Давыдково","Дегунино","Деловой центр",
  "Динамо","Дмитровская","Добрынинская","Долгопрудная","Домодедовская",
  "Достоевская","Дубровка","Жулебино","ЗИЛ","Зорге","Зюзино","Зябликово",
  "Измайловская","Каланчёвская","Калитники","Калужская","Кантемировская",
  "Каховская","Каширская","Киевская","Китай-город","Кленовый бульвар",
  "Кожуховская","Коломенская","Коммунарка","Комсомольская","Коньково",
  "Коптево","Косино","Котельники","Красногвардейская","Краснопресненская",
  "Красносельская","Красные ворота","Крестьянская застава","Кропоткинская",
  "Крылатское","Кузнецкий мост","Кузьминки","Кунцевская","Курская",
  "Лермонтовский проспект","Лесопарковая","Лефортово","Лианозово","Лихоборы",
  "Лобня","Ломоносовский проспект","Лубянка","Лужники","Люблино",
  "Марксистская","Марьина роща","Марьино","Маяковская","Медведково",
  "Международная","Менделеевская","Минская","Митино","Мнёвники",
  "Молодежная","Москворечье","Мякинино","Нагатинская","Нагорная",
  "Народное Ополчение","Нахабино","Нахимовский проспект","Некрасовка",
  "Нижегородская","Новаторская","Новогиреево","Новодачная","Новокосино",
  "Новокузнецкая","Новопеределкино","Новослободская","Новые Черемушки",
  "Одинцово","Озёрная","Окружная","Октябрьская","Октябрьское поле",
  "Ольховая","Орехово","Отрадное","Охотный ряд","Павелецкая","Павшино",
  "Парк Культуры","Парк победы","Партизанская","Первомайская","Перово",
  "Петровский парк","Печатники","Пионерская","Планерная","Площадь Гагарина",
  "Площадь Ильича","Площадь Революции","Подольск","Полежаевская","Пражская",
  "Преображенская площадь",
];

export type Category = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export const CATEGORIES: Category[] = [
  { id: "all", label: "Во всех категориях" },
  {
    id: "vacancy", label: "ВАКАНСИИ",
    children: [
      { id: "rabota", label: "Работа" },
      { id: "podrabotka", label: "Подработка" },
      { id: "rabotu-ishchu", label: "Работу ищу" },
    ],
  },
  {
    id: "zhilye", label: "ЖИЛЬЁ",
    children: [
      { id: "komnata", label: "Комната" },
      { id: "koiko-mesto", label: "Койко-место"},
      { id: "kvartira", label: "Квартира" },
      { id: "gostinica", label: "Гостиница" },
      { id: "agentstvo", label: "Агентство" },
      { id: "ishchu-kvartiru", label: "Ищу квартиру" },
    ],
  },
  {
    id: "taxi", label: "ТАКСИ/ГРУЗОПЕРЕВОЗКА",
    children: [
      { id: "moskva-bishkek", label: "Москва-Бишкек такси" },
      { id: "gruzoperevozki", label: "Грузоперевозки" },
      { id: "taxi-zaezd", label: "Такси заезд-выезд" },
    ],
  },
  {
    id: "prodayu", label: "ПРОДАЮ/КУПЛЮ",
    children: [
      { id: "prodam-tovar", label: "Продам товар" },
      { id: "prodam-avto", label: "Продам авто" },
      { id: "nedvizhimost", label: "Недвижимость" },
      { id: "tehnika", label: "Техника и Электроника" },
      { id: "internet-magazin", label: "Интернет магазин" },
      { id: "tovary-kg", label: "Товары Кыргызстана" },
      { id: "produkty", label: "Продукты питания" },
      { id: "pokupayu", label: "Покупаю" },
    ],
  },
  {
    id: "uslugi", label: "УСЛУГИ",
    children: [
      { id: "med-uslugi", label: "Медицинские услуги" },
      { id: "krasota", label: "Красота и Здоровье" },
      { id: "yurid", label: "Юридические услуги" },
      { id: "svadba", label: "Свадебные услуги" },
      { id: "aviakassa", label: "Авиакасса" },
      { id: "arenda-avto", label: "Аренда авто" },
      { id: "taksopark", label: "Таксопарк" },
      { id: "drugie", label: "Другие услуги" },
    ],
  },
  {
    id: "obuchenie", label: "ОБУЧЕНИЕ",
    children: [
      { id: "kursy", label: "Курсы" },
      { id: "shkola", label: "Школа" },
      { id: "detskiy-sad", label: "Детский сад" },
    ],
  },
  {
    id: "ishchu", label: "ИЩУ",
    children: [
      { id: "ishchu-dokumenty", label: "Ищу документы" },
      { id: "ishchu-cheloveka", label: "Ищу человека" },
      { id: "blagotvoritelnost", label: "Благотворительность" },
    ],
  },
];

export type FilterTab = {
  id: string;
  label: string;
  color: string;
  icon: LucideIcon;
};
export const FILTER_TABS: FilterTab[] = [
  { id: "all",       label: "Популярные",          color: "bg-amber-400 text-amber-950 font-bold",     icon: Star          },
  { id: "vacancy",   label: "ВАКАНСИИ",             color: "bg-blue-400 text-blue-950 font-bold",      icon: Briefcase     },
  { id: "zhilye",    label: "ЖИЛЬЁ",                color: "bg-emerald-400 text-emerald-950 font-bold", icon: Home          },
  { id: "taxi",      label: "ТАКСИ/ГРУЗОПЕРЕВОЗКА", color: "bg-yellow-500 text-yellow-950 font-bold",  icon: Car           },
  { id: "prodayu",   label: "ПРОДАЮ/КУПЛЮ",         color: "bg-purple-400 text-purple-950 font-bold",   icon: ShoppingCart  },
  { id: "uslugi",    label: "УСЛУГИ",               color: "bg-orange-400 text-orange-950 font-bold",   icon: Wrench        },
  { id: "obuchenie", label: "ОБУЧЕНИЕ",              color: "bg-indigo-400 text-indigo-950 font-bold",   icon: GraduationCap },
  { id: "ishchu",    label: "ИЩУ",                  color: "bg-cyan-400 text-cyan-950 font-bold",       icon: Search        },
];

export type PopularItem = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  categoryId: string;
};

export const POPULAR_ITEMS: PopularItem[] = [
  { id: "komnata",        label: "Комната",            emoji: "🏠", color: "bg-emerald-400 text-emerald-950 font-bold ",  categoryId: "zhilye" },
  { id: "koiko-mesto",    label: "Койко-место",        emoji: "🛏️", color: "bg-emerald-400 text-emerald-950 font-bold ",  categoryId: "zhilye" },
  { id: "kvartira",       label: "Kvartira",           emoji: "🏢", color: "bg-emerald-400 text-emerald-950 font-bold ",  categoryId: "zhilye" },
  { id: "gostinica",      label: "Гостиница",          emoji: "🏨", color: "bg-emerald-400 text-emerald-950 font-bold ",  categoryId: "zhilye" },
  { id: "ishu-kvartiru",  label: "Ищу квартиру",       emoji: "🏢", color: "bg-emerald-400 text-emerald-950 font-bold ",  categoryId: "zhilye" },

  { id: "rabota",         label: "Работа",              emoji: "💼", color: "bg-blue-400 text-blue-950 font-bold",     categoryId: "vacancy" },
  { id: "podrabotka",     label: "Подработка",          emoji: "⏰", color: "bg-blue-400 text-blue-950 font-bold",    categoryId: "vacancy" },
  { id: "rabotu-ishchu",  label: "Работу ищу",          emoji: "🎒", color: "bg-blue-400 text-blue-950 font-bold",    categoryId: "vacancy" },

  { id: "moskva-bishkek", label: "Москва-Бишкек такси",  emoji: "🚕", color: "bg-yellow-500 text-yellow-950 font-bold ", categoryId: "taxi" },
  { id: "gruzoperevozki", label: "Грузоперевозки",       emoji: "🚛", color: "bg-yellow-500 text-yellow-950 font-bold",  categoryId: "taxi" },
  { id: "taxi-zaezd",     label: "Такси заезд-выезд",    emoji: "🚖", color: "bg-yellow-500 text-yellow-950 font-bold",  categoryId: "taxi" },
  { id: "arenda-avto",    label: "Аренда авто",          emoji: "🚗", color: "bg-yellow-500 text-yellow-950 font-bold",  categoryId: "taxi" },
  { id: "taksopark",      label: "Таксопарк",            emoji: "🚖", color: "bg-yellow-500 text-yellow-950 font-bold",  categoryId: "taxi" },

  { id: "prodam-tovar",   label: "Продам товар",         emoji: "🛍️", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },
  { id: "prodam-avto",    label: "Продам авто",          emoji: "🚗", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },
  { id: "nedvizhimost",   label: "Недвижимость",         emoji: "🏗️", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },
  { id: "tehnika",        label: "Техника и Электроника",emoji: "🧺", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },
  { id: "internet-magazin",label: "Интернет магазин",    emoji: "💻", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },
  { id: "pokupayu",       label: "Покупаю",              emoji: "🛍️", color: "bg-purple-400 text-purple-950 font-bold ", categoryId: "prodayu" },

  { id: "med-uslugi",     label: "Медицинские услуги",   emoji: "🏥", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "krasota",        label: "Красота и Здоровье",   emoji: "💅", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "yurid",          label: "Юридические услуги",   emoji: "⚖️", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "svadebnye",      label: "Свадебные услуги",     emoji: "🎁", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "produkty",       label: "Продукты питания",     emoji: "🍞", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "aviakassa",      label: "Авиакасса",            emoji: "✈️", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },
  { id: "drugie-uslugi",  label: "Другие услуги",        emoji: "🛠️", color: "bg-orange-400 text-orange-950 font-bold ",   categoryId: "uslugi" },

  { id: "kursy",          label: "Курсы",                emoji: "📜", color: "bg-indigo-400 text-indigo-950 font-bold",   categoryId: "obuchenie" },
  { id: "shkola",         label: "Школа",                emoji: "📚", color: "bg-indigo-400 text-indigo-950 font-bold",   categoryId: "obuchenie" },
  { id: "detskiy-sad",    label: "Детский сад",          emoji: "🎨", color: "bg-indigo-400 text-indigo-950 font-bold",   categoryId: "obuchenie" },

  { id: "agentstvo",      label: "Агентство",            emoji: "🪑", color: "bg-cyan-400 text-cyan-950 font-bold",       categoryId: "ishchu" },
  { id: "ishu-dokumenty", label: "Ищу документы",        emoji: "📁", color: "bg-cyan-400 text-cyan-950 font-bold",       categoryId: "ishchu" },
  { id: "ishu-cheloveka", label: "Ищу человека",         emoji: "📢", color: "bg-cyan-400 text-cyan-950 font-bold",       categoryId: "ishchu" },
];