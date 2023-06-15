# Change Log - Edinburgh SFF

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.7.2] - 2023-06-15

Fix:
  - Events: if user hits back after opening an event, the event, the event popup is not hidden

## [1.7.1] - 2023-06-15

Fix:
  - Events: clicking links causes event below link action to trigger

## [1.7.0] - 2023-06-15

Add:
  - Images: implement Firebase function to generate resized images on upload
    - icon: 32x32
    - thumb: 100x100
    - medium: 300x300
    - large: 800x800
  - Images: Lists now use 'icon' sized images
  - Events: Use 'medium' sized images

## [1.6.0] - 2023-06-14

Add:
  - Events: split events listings into future/current/past

Fix:
  - Events: dates not being displayed correctly, resulting in error

## [1.5.2] - 2023-06-09

Fixed:
  - Map: improve rendering performance
  - Map: wrong fonts

## [1.5.1] - 2023-06-09

Fixed:
  - Masthead: clipping behaviour on small screens
  - Masthead: improve animation

## [1.5.0] - 2023-06-09

Added:
  - Maps: filter by type

## [1.4.1] - 2023-06-09

Fixed:
  - Links Admin:
    - combine add/update dialog
    - click anywhere in list to update
    - move delete to dialog
    - bug that prevented magazines being listed

  - Maps Admin:
    - combine add/update dialog
    - click anywhere in list to update
    - move delete to dialog
    - use image uploader

  - Events Admin:
    - combine add/update dialog
    - click anywhere in list to update
    - move delete to dialog
    - use image uploader

## [1.4.0] - 2023-06-09

Added:
  - Welcome: full width banner
  - Welcome: animate banner

## [1.3.0] - 2023-06-08

Added:
  - Analytics
  - Changelogs
  - Readme

Fixed:
  - Restore loader for Maps that was removed in 1.2.1 due to crash

## [1.2.1] - 2023-06-02

Fixed:
  - Maps crashing on load

## [1.2.0] - 2023-06-01

Added:
  - Markdown support
  - Loaders
  - Link page classificaiton support

## [1.1.0] - 2023-06-01

Added:
  - Modular lazy loading

## [1.0.0] - 2023-05-30

Added:
  - Initial release
