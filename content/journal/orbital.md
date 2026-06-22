---
title: "Orbital"
date: 2025-07-18
tags: [personal-projects, academics, Typescript, PostgresSQL, NextJS, Jest, Sequelize]
slug: orbital
filename: orbital.md
---

# ClassMate

## Overview

[ClassMate](https://github.com/RyanTYT/ClassMate) is an Orbital Project done by me and a friend of mine back in Y1 Summer, which counted for a module's worth of credit. It aims to provide an easy solution to the problem of choosing classes with friends. Typically, freshmen make new friends coming into university taking the same courses at least for around the first 2 semesters. With this, they usually end up wanting to take tutorials, lectures, labs, and other classes with friends taking the same module. However, coordinating between multiple people can end up being very frustrating and time-consuming. Our web application allows users to create friend groups tied to module codes, add one's own personal constraints (like no classes before 10am, lunch break of at least 1 hour, ...) and have the web application generate possible timetables. These timetables would be generated in the batch of the group size such that the "group constraints" (like everybody in the group taking module A's tutorial together on whichever day) can be satisfied. Users would then be able to easily generate working timetables with constraints for the friend groups they want and personal constraints with a simple click.

## My Experience
This software development project was the first trial by fire project I had the pleasure of doing with a teammate - yes, there was a mentor attached to each pair/group but we (unfortunately) did not feel very supported by our mentor at all; at one point, when I asked for guidance on whether we should use a SQL or NoSQL DB, his answer was "if the data is structured, use SQL, else use NoSQL" - Thank you VERY MUCH, as if that isn't the very definition.

Anyway, such a mentor does come with pros and cons. With little help, you do tend to grow faster to accomodate. In the end, in order to survive and make progress fast enough (when I'm mostly carrying), I had to learn a lot really quickly in many areas at once - UI design, frontend React components (useEffect, useState, refreshing components properly, ...), Routing, Project Structure Setup, Deployment, Backend server routing, Backend middleware routing, Testing, ..., (i don't know, is that enough?). Of course, I learnt all this at the point when LLMs were probably at their infancy, just hitting mainstream popularity so I did not have the benefit of asking ChatGPT for every stray, niche issue I was facing - so this was as wild a ride you could imagine. Granted though - this did feel like the last point in my university life that I ever had to face such difficulty searching desperately and looking through documentations thoroughly for an answer; now, for every niche problem I face, ChatGPT/Claude/Gemini provide really good answers with links directly to others who faced the same issue 10 years ago without LLMs.

So, here you go, a picture of the frontend:

<div>
<img 
  src="/RTYT/orbital-photos/landing-dark.png" 
  alt="Landing Page in Dark Mode" 
  className="max-w-xs w-full h-auto mx-auto"
/>
<img 
  src="/RTYT/orbital-photos/settings-dark.png" 
  alt="Settings Page in Dark Mode" 
  className="max-w-xs w-full h-auto mx-auto"
/>
<img 
  src="/RTYT/orbital-photos/timetable-dark.png" 
  alt="Timetable Page in Dark Mode" 
  className="max-w-xs w-full h-auto mx-auto"
/>
<img 
  src="/RTYT/orbital-photos/timetable-light.png" 
  alt="Timetable Page in Dark Mode" 
  className="max-w-xs w-full h-auto mx-auto"
/>
<img 
  src="/RTYT/orbital-photos/login-animation.mov" 
  alt="Login Animation!! (took a while to build from scratch)" 
  className="max-w-xs w-full h-auto mx-auto"
/>
</div>


I think I was particularly surprised every button/interaction/whatever UI had to be somewhat built from scratch - I didn't yet want to rely on MaterialUI or other such frameworks yet as I felt they limited my design choices. So, much of the design was insired by code I found on CodePen or somewhere else similar, even simple designs like the animation of the side menu expanding was coded from scratch ("WOW", is what i, the LLM-reliant person, exclaims now thinking back on this).

## Tech Stack

The final tech stack used was NextJS with React (Typescript, HTML, CSS) deployed on Vercel, SupaBase (PostgresSQL) free tier - after spending about $70 accidentally on AWS's RDS, GCP for the backend server (nodejs server with Typescript + Sequelize ORM for DB) - free tier for a number of requests. There was authorisation checks attached to every site built to ensure user had to be logged in, with authorisation done with JWT tokens. Timetable data and friend group data was aggregated in SupaBase and each page would make some kind of DB call - Friends Page (to find friends and groups), Timetable Page (to find timetable information), Settings Page (to find user-specific settings), ... . Finally, to round this all off, we also built key tests with Jest for regression and integration tests for the frontend and backend calls.

Anyway, the architecture mostly involved the use of z3-solver on the backend to calculate the possible constrained timetables and serve it to the frontend, for which I found building the backend MILES easier than the frontend. Here's a picture of a screenshot:




(I'm writing this quite substantially after the fact, so pardon me if I've forgotten a lot of the specifics built in this project)
