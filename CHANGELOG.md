# Change Log - Edinburgh SFF

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.17] - 2024-05-21 (beta)

Events:
  - Fix: tapping an event location in popup does not hide sidebar

## [2.0.16] - 2024-05-20 (beta)

Locations:
  - Improve: show short titles on map and map highlights
  - Improve: location modal, restrict width of title & wrap

## [2.0.15] - 2024-05-20 (beta)

Event:
  - Fix: unable to update event URLs

App:
  - Add: kofi support

## [2.0.14] - 2024-05-20 (beta)

Events & Events Panel:
  - Fix: more logical event order with starting with the closest event

## [2.0.13] - 2024-05-20 (beta)

App:
  - Fix: wrong location being used for storing generic images on upload

Events Details:
  - Improve:  support non-square images

## [2.0.12] - 2024-05-19 (beta)

Map:
  - Fix: untappable locations on Mobile

## [2.0.11] - 2024-05-19 (beta)

Map:
  - Add: when focusing map pin, hide sidebar
  - Fix: excessive zoom when focusing map pin

Sidebar / Places:
  - Improve: improve performance

## [2.0.10] - 2024-05-19 (beta)

Map:
  - Add: blur map if on mobile and sidebar is open
  - Add: dismiss sidebar and unblur map when tapping background on mobile

App:
  - Fix: negate non-blocking source map errors when building in production

Events:
  - Fix: event datebox cramped
  - Improve: event datebox performance
  - Improve: restyle loader to be a Progress bar

Locations:
  - Fix: missing loader while fetching a location

## [2.0.9] - 2024-05-18 (beta)

App:
  - Fix: remove hardcoded vertical height for wrapper container to mitigate screen sizing issues
  - Fix: only apply Sentry on deployed domains

Map:
  - Fix: remove focus outline
  - Fix: change zoom behaviour, allowing Google Maps to be single-finger interacted

## [2.0.8] - 2024-05-18 (beta)

App:
  - Fix: add Sentry to log error events

## [2.0.7] - 2024-05-18 (beta)

Locations:
  - Fix: location label & digital label placement

## [2.0.6] - 2024-05-18 (beta)

Locations:
  - Fix: flip default title to be the longer title
  - Fix: rename Long Title to Short Title
  - Fix: if no short title, show placeholder containing the Long Title instead

## [2.0.5] - 2024-05-18 (beta)

Locations:
  - Improve: allow for locations to have longer titles (but shorter titles for lists)

App:
  - Add: debug data when fetching documents (only in development mode)

## [2.0.4] - 2024-05-18 (beta)

Map:
  - Improve: performance of map pins

App:
  - Fix: Remove lazy loading from Admin pages as this was causing rendering issues (flickering dialogs)

## [2.0.3] - 2024-05-16 (beta)

App:
  - Fix: Missing sitemap.xml with initial entries
  - Fix: Display verion & link back in dev console 😅

## [2.0.2] - 2024-05-16 (beta)

Social:
  - Fix: Missing card for Twitter/X

## [2.0.1] - 2024-05-16 (beta)

Map:
  - Fix: Performance improvements

Sidebar:
  - Fix: Many performance improvements

Pins:
  - Improve: On desktop, pins sometimes hard to click.

App:
  - Fix: Missing schema describing Organization for Google etc

## [2.0.0] - 2024-05-16 (beta)

General:
  - Add: New fonts, colours and general branding
  - Add: All pages / content can now be accessed/bookmarked via URLs
  - Add: All Events and Locations now update the page title/meta tags

Map:
  - Add: Improved full-screen map
  - Add: Custom zoom buttons & hide streetview
  - Add: Zoom to current location (if allowed)
  - Add: Map pins now colour coded
  - Add: New content filter ("Interesting")
  - Add: New filter widget, with colours
  - Add: Featured pins now use colours from Location type

Sidebar:
  - Add: New side panel
  - Add: Preview Events
  - Add: Preview selected Map Highlights
  - Add: Search for Map locations

Events:
  - Add: All new Events popups

Community:
  - Add: New community page that encourages interaction before getting Discord link

Pages:
  - Add: New global styling for pages
  - Add: Intercept links, force them to follow internal routing

Locations
  - Add: All new Locations popups
  - Add: Tips
  - Add: Opening hours
  - Add: New masthead image
  - Add: Larger image at footer

Admin:
  - Add: All new admin popups
  - Add: Display "dirty' fields encouraging user to save after a change
  - Add: New system admin for common texts
  - Add: Locations - Support for Hightlighted locations

Build / App:
  - Add: New lightweight location handling/indexing for faster loading
  - Update: React 18.3.x
  - Update: bump all dependencies to latest

## [1.13.2] - 2023-11-01

Home:
  - Fix: Discord link on homepage

## [1.13.1] - 2023-08-09

Background:
  - Fix: Sizing bug on desktop

## [1.13.0] - 2023-06-25

App:
  - Add: Page title & meta support

Pages:
  - Add: URL field, hide slugs

## [1.12.0] - 2023-06-25

Sign In:
  - Add: Password reset dialog
  - Add: Display message if sign in fails

## [1.11.0] - 2023-06-25

App:
  - Improve: Remove bottom app menu
  - Improve: Don't hide top menu
  - Add: Primary menu at top

Brand:
  - Fix: Links are not brand color
  - Fix: Burger icon not brand color

Page Admin:
  - Fix: When slug changes, list updated

Admin:
  - Fix: Inconsistent titles on add/update dialogs
  - Fix: Display global loader when performing actions
  - Fix: Index warning

## [1.10.0] - 2023-06-25

Admin:
  - Add: New centralised Listing component for all content types
  - Add: Filterable content tables
  - Improve: Restruct admin components

## [1.9.0] - 2023-06-23

Maps:
  - Add: Click on map marker to open map popup with venue details

Maps Admin:
  - Add: Admin: Add support for venue facilities

## [1.8.1] - 2023-06-22

Events:
  - Fix: Markdown description being doubled up

## [1.8.0] - 2023-06-21

Pages:
  - Add: age rendering
  - Add: page admin
  - Add: page routes

## [1.7.2] - 2023-06-15

Events:
  - Fix: if user hits back after opening an event, the event, the event popup is not hidden

## [1.7.1] - 2023-06-15

Events:
  - Fix: clicking links causes event below link action to trigger

## [1.7.0] - 2023-06-15

Images:
  - Add: implement Firebase function to generate resized images on upload
    - icon: 32x32
    - thumb: 100x100
    - medium: 300x300
    - large: 800x800

Lists:
  - Improve: Lists now use 'icon' sized images

Events:
  - Improve: Use 'medium' sized images

## [1.6.0] - 2023-06-14

Events:
  - Add: split events listings into future/current/past
  - Fix: dates not being displayed correctly, resulting in error

## [1.5.2] - 2023-06-09

Fixed:
  - Map: improve rendering performance
  - Map: wrong fonts

## [1.5.1] - 2023-06-09

Masthead:
  - Fix: clipping behaviour on small screens
  - Improve: improve animation

## [1.5.0] - 2023-06-09

Maps:
  - Add: filter by type

## [1.4.1] - 2023-06-09

Links Admin, Events Admin, Maps Admin:
  - Fix: combine add/update dialog
  - Fix: click anywhere in list to update
  - Fix: move delete to dialog
  - Fix: bug that prevented magazines being listed

## [1.4.0] - 2023-06-09

Welcome:
  - Add: full width banner
  - Add: animate banner

## [1.3.0] - 2023-06-08

App:
  - Add: Analytics
  - Add: Changelogs
  - Add: Readme

Maps:
  - Fix: Restore loader for Maps that was removed in 1.2.1 due to crash

## [1.2.1] - 2023-06-02

Maps:
  - Fix: Maps crashing on load

## [1.2.0] - 2023-06-01

App:
  - Add: Markdown support
  - Add: Loaders

Links:
  - Add: Link page classificaiton support

## [1.1.0] - 2023-06-01

App:
  - Add: Modular lazy loading

## [1.0.0] - 2023-05-30

App:
  - Add: Initial release
