"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Information from "./Information";
import Profile from "./Profile";
import request from "@/lib/request";
import Cookies from "js-cookie";


const Account = () => {
  const userCookie = Cookies.get("session");
  const [session, setSession] = useState(null);
  useEffect(() => {
    if (userCookie) {
      setSession(JSON.parse(userCookie));
    } else {
      redirect("/login");
    }
  }, [userCookie]);

  const [user, setUser] = useState({});

  // Fetch user information from the server and set it to the state
  useEffect(() => {
    if (session && !user.id) {
      const fetchInformation = async () => {
        const res = await request(`/api/users/me?populate=*`, {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        });
        if (res.result) {
          setUser({ ...user, ...res.result });
        }
      };
      fetchInformation();
    }
  }, [session, user]);

  return (
    <>
      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            User settings
          </h1>
        </div>
        {/* Right Content */}
        <div className="col-span-full xl:col-auto">
          <Profile user={user} setUser={setUser} session={session} />
        </div>
        <Information user={user} setUser={setUser} session={session} />
      </div>
    </>
  );
};

export default Account;
