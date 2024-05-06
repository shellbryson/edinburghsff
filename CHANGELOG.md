# Change Log - Edinburgh SFF

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2024-05-12

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
  - Add: New side panel

Sidebar:
  - Add: Preview Events
  - Add: Preview selected Map Highlights
  - Add: Search for Map locations

Events:
  - Add: All new Events popups

Pages:
  - Add: All new Events popups

Locations
  - Add: All new Locations popups

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
