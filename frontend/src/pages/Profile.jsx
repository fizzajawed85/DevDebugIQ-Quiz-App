import React, { useContext, useState, useEffect, Fragment } from "react";
import { AppContext } from "../AppContext";
import { ref, get, set } from "firebase/database";
import { db, storage } from "../firebase/config";
import { getDownloadURL, ref as sRef, uploadBytes } from "firebase/storage";
import { User, Camera, Check, ChevronDown } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

export default function Profile() {
  const { user } = useContext(AppContext);
  const [profile, setProfile] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  // 🧩 Load user data
  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const snap = await get(ref(db, `users/${user.uid}`));
      if (snap.exists()) setProfile(snap.val());
      else
        setProfile({
          first: "",
          last: "",
          email: user.email || "",
          phone: "",
          address: "",
          dob: "",
          gender: "",
          avatar: "",
        });
      setLoading(false);
    }
    load();
  }, [user]);

  // 🧩 Save profile
  async function save() {
    if (!user) return alert("Please login first.");
    await set(ref(db, `users/${user.uid}`), profile);
    alert("Profile updated successfully!");
  }

  // 🧩 Handle avatar upload
  async function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file || !user) return;
    const fileRef = sRef(storage, `avatars/${user.uid}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    const updated = { ...profile, avatar: url };
    setProfile(updated);
    await set(ref(db, `users/${user.uid}`), updated);
  }

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  if (loading)
    return <div className="p-8 text-slate-700 dark:text-white">Loading...</div>;
  if (!user)
    return <div className="p-8 text-slate-700 dark:text-white">Please login</div>;

  return (
    <div className="min-h-screen flex justify-center items-start pt-28 pb-10 px-4 bg-white dark:bg-[#030712] transition-colors">
      <div className="w-full max-w-3xl bg-white/70 dark:bg-[#0d1522] rounded-2xl shadow-lg p-6">
        {/* 🔹 Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border border-slate-300 dark:border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <User size={28} className="text-slate-500" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] p-2 rounded-full cursor-pointer shadow-lg">
              <Camera size={14} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              {user.displayName || "User Profile"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* 🔹 Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={profile.first}
            onChange={(e) => setProfile({ ...profile, first: e.target.value })}
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition"
            placeholder="First Name"
          />
          <input
            value={profile.last}
            onChange={(e) => setProfile({ ...profile, last: e.target.value })}
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition"
            placeholder="Last Name"
          />
          <input
            value={profile.email}
            disabled
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white opacity-75"
            placeholder="Email"
          />
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition"
            placeholder="Phone Number"
          />
          <input
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition"
            placeholder="Address"
          />
          <input
            type="date"
            value={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            className="p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition"
          />

          {/* 🔹 Gender dropdown */}
          <Listbox
            value={profile.gender}
            onChange={(val) => setProfile({ ...profile, gender: val })}
          >
            <div className="relative">
              <Listbox.Button className="w-full p-3 border rounded-lg bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white text-left flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/30 transition">
                {genderOptions.find((g) => g.value === profile.gender)?.label || "Select Gender"}
                <ChevronDown className="ml-2 w-5 h-5" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white dark:bg-[#0d1522] border border-slate-300 dark:border-white/20 rounded-lg shadow-lg py-1 text-slate-800 dark:text-white">
                  {genderOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 px-3 ${
                          active ? "bg-blue-100 dark:bg-blue-900" : ""
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* 🔹 Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={save}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white hover:scale-[1.02] transition-transform"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
