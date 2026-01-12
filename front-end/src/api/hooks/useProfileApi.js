import { useState, useEffect } from "react";
import api from "../axios"; 

export const useProfileApi = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (err.response) {
          setError(`Failed to fetch profile: ${err.response.status}`);
        } else {
          setError(err.message || "Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
