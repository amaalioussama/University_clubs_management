"use client";
import { useState, useEffect } from "react";

const generateSlug = (text) => {
  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-z0-9 -]/g, "") // Remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};

export default function Add() {
  const [isEditBttnActive, setIsEditBttnActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    // Fetch Users
    const getUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}/all-users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // toast.error("Faild to load users!");
          return;
        }

        const result = await response.json();
        setUsers(result);
        return;
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsEditBttnActive(true)}
        className="size-7 bg-green-500/80 text-white flex justify-center items-center rounded text-sm hover:bg-green-500/100 duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {isEditBttnActive && (
        <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-fit bg-[#252525] text-white px-5 py-5 z-50">
          <button
            onClick={() => setIsEditBttnActive(false)}
            type="button"
            className="absolute right-5 top-5 z-[9999]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <form className="flex flex-col items-center gap-y-8">
            <h1 className="font-original_surfer text-3xl text-center">
              Add Club
            </h1>
            <div className="w-full flex flex-col gap-y-5 text-sm max-h-[400px] overflow-y-auto visible-scrollbar pe-3">
              <div className="w-full flex gap-x-3">
                <div className="w-full flex flex-col">
                  <label htmlFor="logo" className="w-fit">
                    Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    className="w-full outline-none border-b py-2 bg-transparent focus:border-white"
                    required
                  />
                </div>
                <div className="w-full flex flex-col">
                  <label htmlFor="background" className="w-fit">
                    Background
                  </label>
                  <input
                    type="file"
                    name="background"
                    id="background"
                    className="w-full outline-none border-b py-2 bg-transparent focus:border-white"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="president" className="w-fit">
                  President
                </label>
                <select
                  name="president"
                  id="president"
                  className="outline-none border-b py-2 bg-transparent focus:border-white cursor-pointer"
                  required
                >
                  {users?.map((item, key) => (
                    <option key={key} value={item?.id} className="text-black">
                      {item?.first_name + " " + item?.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="w-fit">
                  Email
                </label>
                <input
                  type="email"
                  name=""
                  id="email"
                  placeholder="Email"
                  className="outline-none border-b py-2 bg-transparent focus:border-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="name" className="w-fit">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  className="outline-none border-b py-2 bg-transparent focus:border-white"
                  required
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="description" className="w-fit">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Description ..."
                  className="outline-none border-b py-2 bg-transparent focus:border-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="slug" className="w-fit">
                  Slug
                </label>
                <div className="w-full flex items-end gap-x-3">
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    placeholder="Slug"
                    className="w-full outline-none border-b py-2 bg-transparent focus:border-white"
                    required
                    value={generateSlug(slug)}
                    onChange={({ target }) => setSlug(target.value)}
                  />
                  <button
                    onClick={() => setSlug(generateSlug(name))}
                    type="button"
                    className="h-[30px] bg-slate-100 text-black/80 px-3 rounded-md text-xs font-medium hover:bg-white hover:text-black duration-300"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[50px] text-black bg-white/90 hover:bg-white duration-300 font-original_surfer"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </>
  );
}
