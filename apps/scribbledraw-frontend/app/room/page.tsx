"use client";
import React, { useEffect, useState } from "react";
import {
  Video,
  Settings,
  User,
  Plus,
  Calendar,
  Clock,
  Users,
  Edit3,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  LogOut,
  Bell,
  Shield,
  Palette,
  Globe,
  Link2Icon,
  ClipboardIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@repo/common/server";
import { useSession } from "next-auth/react";
import { Session } from "../api/auth/[...nextauth]/options";
import axios from "axios";
import { getRoomid, getRoomidFromSlug } from "../actions/room";
import { getUserRooms, updateUser } from "../actions/getUserRooms";

// Mock session data for demo
const mockSession = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  token: "mock-jwt-token",
};

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const { data, status } = useSession();
  const session = data as Session;
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const router = useRouter();
  const token = session?.token;
  // Profile update states
  const [profileName, setProfileName] = useState<string>(session.user.name || "");
  const [profileEmail, setProfileEmail] = useState<string>(session.user.email || "");
  const [profilePhoto, setProfilePhoto] = useState<string>(session.user.image || mockSession.user.image);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");
  const [roomIdLater, setRoomIdLater] = useState("");
  const [copied, setCopied] = useState(false);
  const [userRooms, setUserRooms] = useState<Array<{ id: number, slug: string, createdAt: string }>>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // if (!session) {
  //   router.push("/signin")
  // }
  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const rooms = await getUserRooms(token);
        setUserRooms(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [token]);

  const createRoom = async () => {
    try {
      const slug = await getRoomid(token);
      const roomId = await getRoomidFromSlug(slug.roomId, token);
      if (roomId.room.id) {
        router.push(`/main-canvas/${roomId.room.id}`);
      }
    } catch (error) {
      console.error("Error creating room", error);
    }
  };
  const createRoomforLater = async () => {
    try {
      const res = await getRoomid(token);
      setRoomIdLater(res.roomId);
    } catch (error) {
      console.error("Error creating room", error);
    }
  }

  const joinRoomWithCode = async () => {
    const slug = prompt("Enter room code:") || "";
    const roomId = await getRoomidFromSlug(slug, token);
    if (roomId.room.id) {
      router.push(`/main-canvas/${roomId.room.id}`);
    }
  };

  const updateProfile = () => {
    // Update profile on server
    (async () => {
      try {
        const nameToSend = profileName?.trim() || "User";
        const emailToSend = profileEmail?.trim() || "user@example.com";
        const photoToSend = profilePhoto?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToSend)}`;

        const res = await updateUser(token, nameToSend, emailToSend, photoToSend);


        if (res.data?.user) {
          const u = res.data.user;
          setProfileName(u.name || nameToSend);
          setProfileEmail(u.email || emailToSend);
          setProfilePhoto(u.photo || photoToSend);
          setIsEditingProfile(false);
          alert("Profile updated successfully!");
        } else {
          console.error("Unexpected response", res.data);
          alert("Failed to update profile");
        }
      } catch (err) {
        console.error("updateProfile error", err);
        alert("Failed to update profile");
      }
    })();
  };

  const renderHomeContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-800 mb-4">
          Premium Canvas meetings. Now free for everyone.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We re-engineered the service we built for secure business meetings,
          ScribbleHub, to make it free and available for all.
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Create Room Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mr-4">
              <Video className="w-6 h-6 text-sky-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              New meeting
            </h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={createRoomforLater}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {copied ? (
                <>
                  <ClipboardIcon className="w-5 h-5 mr-2" />
                  Copied: {roomIdLater}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Meeting for later
                </>
              )}
            </button>

            {roomIdLater && !copied && (
              <p className="text-center text-gray-600 text-sm">
                Room Code: <code className="font-mono">{roomIdLater}</code>
              </p>
            )}
            <button
              onClick={createRoom}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Link2Icon className="w-5 h-5 mr-2" />
              Start an instant meeting
            </button>
          </div>
        </div>

        {/* Join Room Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Join a meeting
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Enter a meeting ID or personal link name
            </p>
            <button
              onClick={joinRoomWithCode}
              className="w-full border-2 border-sky-600 text-sky-600 hover:bg-sky-50 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Join with a code
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Ready to join?
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-medium text-gray-800">{profileName}</p>
              <p className="text-sm text-gray-600">{profileEmail}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-full ${isAudioOn ? "bg-gray-200 hover:bg-gray-300" : "bg-red-500 hover:bg-red-600"} transition-colors`}
            >
              {isAudioOn ? (
                <Mic className="w-5 h-5 text-gray-700" />
              ) : (
                <MicOff className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full ${isVideoOn ? "bg-gray-200 hover:bg-gray-300" : "bg-red-500 hover:bg-red-600"} transition-colors`}
            >
              {isVideoOn ? (
                <Video className="w-5 h-5 text-gray-700" />
              ) : (
                <VideoOff className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Rooms */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Recent rooms
          </h3>
          <button
            onClick={() => router.push('/rooms')}
            className="text-sky-600 hover:text-sky-700 text-sm font-medium"
          >
            View all
          </button>
        </div>
        <div className="space-y-3">
          {isLoadingRooms ? (
            <div className="text-center py-4 text-gray-600">Loading rooms...</div>
          ) : userRooms.length === 0 ? (
            <div className="text-center py-4 text-gray-600">No rooms found</div>
          ) : (
            userRooms.slice(0, 5).map((room) => {
              const createdDate = new Date(room.createdAt);
              const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

              return (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                      <Video className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Room {room.id}</p>
                      <p className="text-sm text-gray-600">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {daysAgo === 0
                          ? 'Today'
                          : daysAgo === 1
                            ? 'Yesterday'
                            : `${daysAgo} days ago`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/main-canvas/${room.id}`)}
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Join
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Profile Settings
          </h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center text-sky-600 hover:text-sky-700"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {isEditingProfile ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditingProfile && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white hover:bg-sky-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Profile Photo</h3>
              <p className="text-sm text-gray-600">
                Update your profile picture
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {isEditingProfile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {isEditingProfile && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={updateProfile}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          General Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Notifications</p>
              <p className="text-sm text-gray-600">
                Receive notifications about meetings
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? "bg-sky-600" : "bg-gray-300"}`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notifications ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Dark Mode</p>
              <p className="text-sm text-gray-600">Use dark theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-sky-600" : "bg-gray-300"}`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Language</p>
              <p className="text-sm text-gray-600">
                Choose your preferred language
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Privacy & Security
        </h3>

        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <p className="font-medium text-gray-800">Change Password</p>
            <p className="text-sm text-gray-600">
              Update your account password
            </p>
          </button>

          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <p className="font-medium text-gray-800">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-gray-600">
              Add an extra layer of security
            </p>
          </button>

          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <p className="font-medium text-gray-800">Privacy Policy</p>
            <p className="text-sm text-gray-600">Review our privacy policy</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
                <Palette className="w-5 h-5 text-white" />
              </div>
              {/* CHANGE: Removed gradient from text for a cleaner look */}
              <span className="text-2xl font-bold text-slate-900">
                Scribblehub
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab("home")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "home"
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "profile"
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "settings"
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Settings
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {mockSession.user.name}
                  </p>
                </div>
              </div>

              <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && renderHomeContent()}
        {activeTab === "profile" && renderProfileContent()}
        {activeTab === "settings" && renderSettingsContent()}
      </main>
    </div>
  );
}
