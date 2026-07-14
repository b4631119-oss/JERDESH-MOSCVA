"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  telegram_username: string | null;
  whatsapp_number: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  favoriteIds: Set<number>;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  toggleFavorite: (postId: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  favoriteIds: new Set(),
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  toggleFavorite: async () => false,
});

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const userRef = useRef<User | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const loadUserData = useCallback(async (currentUser: User | null) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (!currentUser) {
      setProfile(null);
      setFavoriteIds(new Set());
      setLoading(false);
      isLoadingRef.current = false;
      return;
    }

    try {
      const [profileResult, favResult] = await withTimeout(
        Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
          supabase.from("favorites").select("post_id").eq("user_id", currentUser.id),
        ]),
        8000
      );

      if (profileResult.data) {
        setProfile(profileResult.data);
      } else {
        setProfile({
          id: currentUser.id,
          full_name: "",
          phone_number: currentUser.phone || null,
          telegram_username: null,
          whatsapp_number: null,
        });
      }

      const ids = (favResult.data ?? []).map((f) => Number(f.post_id)).filter((id) => !isNaN(id));
      setFavoriteIds(new Set(ids));
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  const ensureFreshSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) return null;

    const expiresAtMs = (session.expires_at ?? 0) * 1000;
    const needsRefresh = expiresAtMs <= Date.now() + 60_000;

    if (!needsRefresh) return session;

    const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.warn("Session refresh skipped:", refreshError.message);
      return null;
    }

    return refreshedData.session;
  }, []);

  const refreshUser = useCallback(async () => {
    const session = await ensureFreshSession();
    await loadUserData(session?.user ?? null);
  }, [ensureFreshSession, loadUserData]);

  const toggleFavorite = useCallback(async (postId: number): Promise<boolean> => {
    const currentUser = userRef.current;
    if (!currentUser) {
      toast.error("Пожалуйста, войдите в аккаунт");
      return false;
    }

    let isFav = false;
    setFavoriteIds((prev) => {
      isFav = prev.has(postId);
      const next = new Set(prev);
      if (isFav) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    try {
      if (isFav) {
        await supabase.from("favorites").delete().eq("user_id", currentUser.id).eq("post_id", postId);
      } else {
        await supabase.from("favorites").insert({ user_id: currentUser.id, post_id: postId });
      }
      return !isFav;
    } catch {
      toast.error("Ошибка при обновлении избранного");
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(postId);
        } else {
          next.delete(postId);
        }
        return next;
      });
      return isFav;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let initialized = false;

    const initAuth = async () => {
      const session = await ensureFreshSession();
      if (isMounted) {
        initialized = true;
        setUser(session?.user ?? null);
        await loadUserData(session?.user ?? null);
      }
    };

    initAuth();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      
      if (event === "INITIAL_SESSION" && initialized) return;
      
      const newId = session?.user?.id ?? null;
      const oldId = userRef.current?.id ?? null;
      if (newId === oldId && event !== "SIGNED_OUT") return;

      if (isMounted) {
        setUser(session?.user ?? null);
        loadUserData(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      authListener.unsubscribe();
    };
  }, [ensureFreshSession, loadUserData]);

  const value = useMemo(
    () => ({
      user,
      profile,
      favoriteIds,
      loading,
      isAuthenticated: !!user,
      refreshUser,
      toggleFavorite,
    }),
    [favoriteIds, loading, profile, refreshUser, toggleFavorite, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);