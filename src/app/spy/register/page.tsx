"use client";

import React from "react";
import { HackerError } from "@/components/hacker-error";
import { HackerRegistration } from "@/components/hacker-registration";
import { HackerErrorDemo } from "@/components/hacker-error-demo";
import { HackerRegistrationDemo } from "@/components/hacker-registration-demo";
const page = () => {
  return (
    <div>
      {/* <HackerErrorDemo />
      <HackerRegistrationDemo />
      <HackerError /> */}
      <HackerRegistration />
    </div>
  );
};

export default page;
