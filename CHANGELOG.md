# Changelog

All notable changes to the "blade-components" extension will be documented in this file.

## [v1.0.0]

- Mayor realease with basic functionallity to extend upon

### Features

- Class component tag autocompletion
- Anonymous component tag autocompletion
- Completetion details for component type
- Basic component attribute completion

## [v1.0.1]

- Modified the package details

## [v1.1.0]

- Added new features to tag auto-completion and attribute auto-completion

### Features

- Added attribute fill on class file tag auto-completion
- Modified attribute auto-completion for quality of life

## [v1.1.1]

- Added better intellisense when auto-completing attributes

### Features

- Added smart insert of attributes on varaible type

## [v1.2.1]

- Added prop detection for anonymous components attribut completion

### Features

- Auto-completion on props declared directly on an anonymous blade component

## [v1.2.2]

- Minor bugfixes on regex pattern matching for props

### Bugfix

- Fixed a bug when matching props containg values with quoted strings with commas inside of them

## [v1.2.3]

- Minor bugfixes on regex pattern matching for props

### Bugfix

- Fixed bug on props auto complete when props have string defaults

## [v1.2.4]

- Optimization of document parsing by adding a cache

### Bugfix

- Added optimizations for loading component auto-completions, by offloading file parsing to extension activation and using a cache