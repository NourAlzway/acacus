import { createStore } from 'acacus';

interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'ar' | 'de';
  notifications: boolean;
  autoSave: boolean;
  fontSize: number;
}

interface SettingsState {
  settings: Settings;
  changeHistory: Array<{
    timestamp: number;
    field: keyof Settings;
    oldValue: Settings[keyof Settings];
    newValue: Settings[keyof Settings];
  }>;
  unsavedChanges: boolean;
}

const defaultSettings: Settings = {
  theme: 'light',
  language: 'en',
  notifications: true,
  autoSave: false,
  fontSize: 14,
};

// Try to load settings from localStorage
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem('app-settings');
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
};

const initialState: SettingsState = {
  settings: loadSettingsFromStorage(),
  changeHistory: [],
  unsavedChanges: false,
};

export const settingsStore = createStore(initialState)
  .action(
    'updateSetting',
    (state, field: keyof Settings, value: Settings[keyof Settings]) => {
      const oldValue = state.settings[field];

      return {
        settings: { ...state.settings, [field]: value },
        changeHistory: [
          ...state.changeHistory,
          {
            timestamp: Date.now(),
            field,
            oldValue,
            newValue: value,
          },
        ].slice(-20), // Keep last 20 changes
        unsavedChanges: true,
      };
    }
  )
  .action('markAsSaved', () => ({
    unsavedChanges: false,
  }))
  .action('clearHistory', () => ({
    changeHistory: [],
  }))
  .action('revertToDefaults', () => ({
    settings: defaultSettings,
    changeHistory: [],
    unsavedChanges: true,
  }))

  .build();

// Subscribe to state changes for side effects
settingsStore.subscribe((state, prevState) => {
  // Persist settings to localStorage when they change
  if (state.settings !== prevState.settings) {
    try {
      localStorage.setItem('app-settings', JSON.stringify(state.settings));
      console.log('Settings persisted to localStorage');
    } catch (error) {
      console.error('Failed to persist settings:', error);
    }
  }

  // Apply theme changes to document
  if (
    state.settings.theme !== prevState.settings.theme ||
    state.settings.fontSize !== prevState.settings.fontSize
  ) {
    document.body.className = `theme-${state.settings.theme}`;
    document.body.style.fontSize = `${state.settings.fontSize}px`;
    console.log(
      `Theme applied: ${state.settings.theme}, Font size: ${state.settings.fontSize}px`
    );
  }

  // Auto-save mechanism
  if (
    state.settings.autoSave &&
    state.unsavedChanges &&
    !prevState.unsavedChanges
  ) {
    // Simulate saving to server
    setTimeout(() => {
      const updateSetting = settingsStore.use(actions => actions.markAsSaved);
      updateSetting();
      console.log('Auto-saved settings to server');
    }, 2000);
  }

  // Log changes
  if (state.changeHistory.length > prevState.changeHistory.length) {
    const lastChange = state.changeHistory[state.changeHistory.length - 1];
    console.log(
      `Setting changed: ${lastChange.field} = ${lastChange.newValue} (was: ${lastChange.oldValue})`
    );
  }
});
