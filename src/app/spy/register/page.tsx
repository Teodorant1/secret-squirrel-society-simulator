"use client";

import React from "react";
import { HackerError } from "@/components/hacker-error";
import { HackerRegistration } from "@/components/hacker-registration";

const page = () => {
  return (
    <div>
      <HackerError />
      <HackerRegistration />
    </div>
  );
};

export default page;
