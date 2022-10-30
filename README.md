# Air Traffic Map

This map displays aircraft distribution on a big scale as well as filters them by the country flag.

## Inspiration

Have you ever wondered what the global air transportation system looks like? As for myself, I always wanted to see aircraft locations, their density over the countries or their routes through the Atlantic. So this curiosity eventually pushed me towards the creation of this project.

![Project screenshot](https://i.imgur.com/a73rPk4.png)

## What it does

**Air Traffic Map** shows aircraft in the format of a so-called heatmap layer, so users can see the busiest air routes or the large hubs all over the world. A drop-down list gives you the possibility to filter planes by their country and the graph below helps you to see real-time aircraft distribution by the flag.

## How I built it

The project is built using javascript as a programming language, Google Maps Platform for visualising data as well as map styling, and AirLabs API to obtain plane coordinates.

## Challenges I ran into

While working on this project I had a few challenges which were successfully solved. One of them was sorting planes by their flag _(combining the "UK" and "Great Britain" aircraft into one category as it was slightly messed up in the API response)_.

## Accomplishments that I'm proud of

- Creating the picture that was in my head
- Making it till the end
- Learning a new tool from scratch (_Google Maps Platform_)

## What I learned

- Map styling and data visualisation using the HeatmapLayer on Google Maps Platform
- Adapting charts for all types of displays
- Participating in the hackathon
- I also improved my js skills as I'm new to it.

## What's next for Air Traffic Map

- [x] Push version 1.0 on the GitHub
- [ ] Add more statistics data, visualised by responsive charts
- [ ] Visualise large airports and their real-time busyness on the same map
