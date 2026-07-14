"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  telegram_username: string | null;
  whatsapp_number: string | null;
}

interface EditableField {
  full_name: string;
  phone_number: string;
  telegram_username: string;
  whatsapp_number: string;
  password_stub: string;
}

interface FieldProps {
  label: string;
  fieldKey: keyof EditableField;
  type?: string;
  readonly?: boolean;
  isPassword?: boolean;
  suffix?: React.ReactNode;
  fields: EditableField;
  editingField: keyof EditableField | null;
  setEditingField: (key: keyof EditableField | null) => void;
  setFields: React.Dispatch<React.SetStateAction<EditableField>>;
}

function Field({
  label,
  fieldKey,
  type = "text",
  readonly = false,
  isPassword = false,
  suffix,
  fields,
  editingField,
  setEditingField,
  setFields,
}: FieldProps) {
  const isEditing = editingField === fieldKey;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 bg-[#F5F7FF] rounded-2xl border-2 transition-all ${
          isEditing ? "border-blue-400 ring-2 ring-blue-50" : "border-transparent"
        }`}
      >
        {isEditing && !readonly ? (
          <input
            autoFocus
            type={type}
            className="bg-transparent outline-none w-full text-gray-800 text-sm"
            value={fields[fieldKey] || ""}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, [fieldKey]: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingField(null);
            }}
          />
        ) : (
          <span className="text-gray-800 text-sm font-medium truncate">
            {isPassword ? "••••••••••" : fields[fieldKey] || "—"}
          </span>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {suffix}
          {!readonly && (
            <button
              onClick={() => setEditingField(isEditing ? null : fieldKey)}
              className={`${
                isEditing ? "text-blue-500" : "text-gray-300 hover:text-blue-500"
              } transition-colors`}
            >
              <Pencil size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [, setProfile] = useState<Profile | null>(null);
  const [fields, setFields] = useState<EditableField>({
    full_name: "",
    phone_number: "",
    telegram_username: "",
    whatsapp_number: "",
    password_stub: "shadowpassword123",
  });
  const [editingField, setEditingField] = useState<keyof EditableField | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const hasFetchedRef = useRef(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (authLoading || !user?.id || hasFetchedRef.current) return;

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (data) {
          setProfile(data);
          setFields({
            full_name: data.full_name ?? "",
            phone_number: data.phone_number ?? "",
            telegram_username: data.telegram_username ?? "",
            whatsapp_number: data.whatsapp_number ?? "",
            password_stub: "shadowpassword123",
          });
        } else {
          setProfile({
            id: user.id,
            full_name: "",
            phone_number: "",
            telegram_username: "",
            whatsapp_number: "",
          });
          setFields({
            full_name: "",
            phone_number: "",
            telegram_username: "",
            whatsapp_number: "",
            password_stub: "shadowpassword123",
          });
        }

        hasFetchedRef.current = true; // защита от повторного fetch
        setHasFetched(true);          // обновляем рендер
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]); 
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedProfile = {
        id: user.id,
        full_name: fields.full_name.trim(),
        phone_number: fields.phone_number.trim(),
        telegram_username: fields.telegram_username.trim(),
        whatsapp_number: fields.whatsapp_number.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) {
        toast.error("Ошибка сохранения: " + error.message);
      } else {
        setEditingField(null);
        setProfile(updatedProfile);
        await refreshUser();
        toast.success("Профиль успешно обновлен!");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Сетевая ошибка при сохранении профиля");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Вы вышли из системы");
  };

  const fieldProps = { fields, editingField, setEditingField, setFields };

  if (authLoading || (user && loading && !hasFetched)) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Личный кабинет недоступен
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Пожалуйста, авторизуйтесь через шапку сайта для просмотра профиля.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="px-1 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-6">
          <Field label="ФИО" fieldKey="full_name" {...fieldProps} />
          <Field
            label="Telegram (юзернейм или номер)"
            fieldKey="telegram_username"
            {...fieldProps}
          />
          <Field label="WhatsApp номер" fieldKey="whatsapp_number" {...fieldProps} />
        </div>

        <div className="space-y-6">
          <Field label="Номер телефона" fieldKey="phone_number" {...fieldProps} />
          <Field
            label="Пароль"
            fieldKey="password_stub"
            isPassword
            readonly
            {...fieldProps}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-10 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white rounded-full font-bold text-sm shadow-md shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
          <button
            onClick={() => router.push(`/profile/${user.id}`)}
            className="px-7 py-3 border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-blue-50 rounded-full font-bold text-sm transition-all text-center w-full sm:w-auto"
          >
            Публичный профиль
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-gray-100 sm:border-none">
          <button
            onClick={() => {
              if (confirm("Удалить аккаунт? Это действие нельзя отменить.")) {
                supabase.auth.signOut().then(() => router.push("/"));
              }
            }}
            className="px-5 py-2.5 border border-red-300 text-red-400 hover:bg-red-50 rounded-full font-semibold text-sm transition-all text-center w-full sm:w-auto"
          >
            Удалить аккаунт
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full font-semibold text-sm transition-all text-center w-full sm:w-auto"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}