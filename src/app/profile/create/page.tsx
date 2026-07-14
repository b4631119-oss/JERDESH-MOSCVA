"use client";
    
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { CITIES, CATEGORIES } from "@/src/data/mock";
import { useAuth } from "@/src/context/AuthContext";

interface FormData {
  title: string;
  description: string;
  price: string;
  metro: string;
  category: string;
  phone: string;
  whatsapp: string;
  telegram: string;
}

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

function ImageSlot({
  item,
  onReplace,
  onRemove,
}: {
  item: ImageItem;
  onReplace: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative w-[85px] h-[85px] sm:w-[90px] sm:h-[90px] rounded-xl overflow-hidden group shrink-0">
      <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-white text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full"
        >
          Заменить
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-white text-[10px] font-semibold bg-red-500/70 px-2 py-0.5 rounded-full"
        >
          Удалить
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onReplace(item.id, f);
        }}
      />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-gray-500 font-medium mb-1 block">{children}</span>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-gray-300";

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, profile, loading: authLoading } = useAuth();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    metro: "По всей Москве",
    category: "all",
    phone: "",
    whatsapp: "",
    telegram: "",
  });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imagesRef = useRef<ImageItem[]>([]);

  const defaultContacts = useMemo(
    () => ({
      phone: profile?.phone_number ?? user?.phone ?? user?.user_metadata?.phone_number ?? "",
      whatsapp: profile?.whatsapp_number ?? user?.user_metadata?.whatsapp_number ?? "",
      telegram: profile?.telegram_username ?? user?.user_metadata?.telegram_username ?? "",
    }),
    [profile, user]
  );

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const addImages = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер одной из фотографий превышает 5 МБ");
        return false;
      }
      return true;
    });

    const newItems: ImageItem[] = validFiles
      .slice(0, 4 - images.length)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const replaceImage = (id: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Размер фотографии превышает 5 МБ");
      return;
    }
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.previewUrl);
          return { ...img, file, previewUrl: URL.createObjectURL(file) };
        }
        return img;
      })
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const img of images) {
      const ext = img.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("post-images")
        .upload(fileName, img.file, { upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from("post-images").getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || form.title.trim().length < 6) {
      setError("Заголовок должен содержать не менее 6 symbols");
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      setError("Описание должно быть более подробным (минимум 15 символов)");
      return;
    }
    if (form.price && parseFloat(form.price) < 0) {
      setError("Цена не может быть отрицательной");
      return;
    }
    if (!form.phone.trim() && !form.whatsapp.trim() && !form.telegram.trim()) {
      setError("Укажите хотя бы один способ связи (Телефон, WhatsApp или Telegram)");
      return;
    }

    if (!user) return;

    setError(null);
    setSubmitting(true);

    try {
      const userId = user.id;

      const imageUrls = images.length > 0 ? await uploadImages() : [];

      const { error: insertError } = await supabase.from("posts").insert([
        {
          user: profile?.full_name || "Автор",
          user_id: userId,                      
          title: form.title.trim(),
          description: form.description.trim(),
          text: form.description.trim(),
          price: form.price ? parseFloat(form.price) : null,
          city: form.metro === "По всей Москве" ? "Москва" : form.metro, 
          categoryId: form.category === "all" ? "zhilye" : form.category, 
          phone: form.phone.trim() || null,
          whatsapp: form.whatsapp.trim() || null,
          telegram: form.telegram.trim() || null,
          image: imageUrls.length > 0 ? imageUrls[0] : "/main.svg",
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Доступ ограничен</h3>
        <p className="text-sm text-gray-500 mb-6">Чтобы создать объявление, вам необходимо войти в систему.</p>
        <Link href="/" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-5 sm:mb-6">Создать объявление</h1>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none flex-nowrap">
        {images.map((img) => (
          <ImageSlot
            key={img.id}
            item={img}
            onReplace={replaceImage}
            onRemove={removeImage}
          />
        ))}
        {images.length < 4 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-[85px] h-[85px] sm:w-[90px] sm:h-[90px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-blue-300 hover:text-blue-400 transition-all shrink-0"
          >
            <ImagePlus size={20} />
            <span className="text-[9px] sm:text-[10px] font-medium">Фото</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addImages(e.target.files)}
        />
        {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-[85px] h-[85px] sm:w-[90px] sm:h-[90px] rounded-xl bg-gray-50 shrink-0 hidden sm:block"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-4">
          <div>
            <Label>Город / Метро</Label>
            <select value={form.metro} onChange={set("metro")} className={inputCls}>
              {CITIES.map((metroName) => (
                <option key={metroName} value={metroName}>
                  {metroName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Категория</Label>
            <select value={form.category} onChange={set("category")} className={inputCls}>
              {CATEGORIES.map((cat) => {
                if (cat.children && cat.children.length > 0) {
                  return (
                    <optgroup key={cat.id} label={cat.label}>
                      {cat.children.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>
                  );
                }
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <Label>Заголовок</Label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              className={inputCls}
              placeholder="Например:Сдаю комнату на длительный срок"
            />
          </div>
          <div>
            <Label>Описание</Label>
            <textarea
              rows={4}
              placeholder="Опишите подробности (условия, и тд)..."
              value={form.description}
              onChange={set("description")}
              className={inputCls + " resize-none"}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Цена рублей</Label>
            <input
              type="number"
              placeholder="Цена"
              value={form.price}
              onChange={set("price")}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Телефон</Label>
            <input
              type="tel"
              placeholder="Номер телефона"
              value={form.phone || defaultContacts.phone}
              onChange={set("phone")}
              className={inputCls}
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <input
              type="text"
              placeholder="Ссылка или номер"
              value={form.whatsapp || defaultContacts.whatsapp}
              onChange={set("whatsapp")}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Telegram</Label>
            <input
              type="text"
              placeholder="Ссылка или юзернейм"
              value={form.telegram || defaultContacts.telegram}
              onChange={set("telegram")}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={submitting}
          className="w-full sm:w-auto text-center px-7 py-3 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full font-bold text-sm transition-all"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto justify-center px-8 py-3 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white rounded-full font-bold text-sm shadow-md shadow-blue-100 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Публикуем..." : "Опубликовать"}
        </button>
      </div>
    </div>
  );
}