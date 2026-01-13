import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { useProfileApi } from "../../../api/hooks/useProfileApi";


const ProfilePage = () => {
  const { profile, loading, error } = useProfileApi();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center">
            <FaTimes className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <FaUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Aucun profil</h2>
          <p className="text-gray-600">Veuillez vous connecter</p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const badges = {
      USER: { label: "Utilisateur", color: "bg-blue-100 text-blue-800" },
      AGENT: { label: "Agent", color: "bg-green-100 text-green-800" },
      ADMIN: { label: "Admin", color: "bg-purple-100 text-purple-800" },
    };
    return badges[role] || badges.USER;
  };

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Ici vous appelleriez votre API pour sauvegarder
    console.log("Sauvegarde:", editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const currentProfile = isEditing ? editedProfile : profile;
  const roleBadge = getRoleBadge(profile.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-t-2xl shadow-xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="w-12 h-12 text-white" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.full_name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        full_name: e.target.value,
                      })
                    }
                    className="text-3xl font-bold text-gray-800 border-b-2 border-indigo-500 focus:outline-none mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {currentProfile.full_name}
                  </h1>
                )}
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge.color}`}
                  >
                    <FaShieldAlt className="w-4 h-4 inline mr-1" />
                    {roleBadge.label}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ID: {profile.account_id}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FaEdit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FaSave className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informations de profil */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Informations personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-800 font-medium">
                  {currentProfile.email}
                </p>
              </div>
            </div>

            {/* Téléphone */}
            {currentProfile.phone && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          phone: e.target.value,
                        })
                      }
                      className="text-gray-800 font-medium border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {currentProfile.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Adresse */}
            {currentProfile.address && (
              <div className="flex items-start space-x-4 md:col-span-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Adresse</p>
                  {isEditing ? (
                    <textarea
                      value={currentProfile.address}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          address: e.target.value,
                        })
                      }
                      className="w-full text-gray-800 font-medium border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
                      rows="2"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {currentProfile.address}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
