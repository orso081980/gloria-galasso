import {
  faAward,
  faBaby,
  faBookOpen,
  faBriefcase,
  faBuildingColumns,
  faChevronDown,
  faCodeCommit,
  faEnvelope,
  faEarthEurope,
  faFlask,
  faGears,
  faGlobe,
  faGraduationCap,
  faLandmark,
  faLanguage,
  faLocationDot,
  faMicrophoneLines,
  faPlay,
  faRotateRight,
  faScrewdriverWrench,
  faStar,
  faBrain,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

/**
 * Font Awesome icons that can be used by name (also from the markdown front matter: `icon: brain`).
 * Only icons listed here are bundled, so add a line here before using a new one.
 */
export const FA_ICONS: Record<string, IconDefinition> = {
  award: faAward,
  baby: faBaby,
  'book-open': faBookOpen,
  brain: faBrain,
  briefcase: faBriefcase,
  'building-columns': faBuildingColumns,
  'chevron-down': faChevronDown,
  'code-commit': faCodeCommit,
  envelope: faEnvelope,
  'earth-europe': faEarthEurope,
  flask: faFlask,
  gears: faGears,
  globe: faGlobe,
  'graduation-cap': faGraduationCap,
  landmark: faLandmark,
  language: faLanguage,
  'location-dot': faLocationDot,
  'microphone-lines': faMicrophoneLines,
  play: faPlay,
  'rotate-right': faRotateRight,
  'screwdriver-wrench': faScrewdriverWrench,
  star: faStar,
}
