import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import type { Settings } from 'src/types/settings';

const defaultSettings: Settings = {
  colorPreset: 'indigo',
  contrast: 'normal',
  direction: 'ltr',
  layout: 'vertical',
  navColor: 'evident',
  paletteMode: 'light',
  responsiveFontSizes: true,
  stretch: false
};

interface State {
  openDrawer: boolean;
}

const initialState: State = {
  openDrawer: false
};

export interface SettingsContextType extends Settings, State {
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
  handleReset: () => void;
  handleUpdate: (settings: Settings) => void;
  isCustom: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  ...initialState,
  handleDrawerClose: () => {},
  handleDrawerOpen: () => {},
  handleReset: () => {},
  handleUpdate: () => {},
  isCustom: false
});

interface SettingsProviderProps {
  children?: ReactNode;
  onReset?: () => void;
  onUpdate?: (settings: Settings) => void;
  settings?: Settings;
}

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const {
    children,
    onReset = () => {},
    onUpdate = () => {},
    settings: initialSettings
  } = props;
  const [state, setState] = useState<State>(initialState);

  const settings = useMemo(
    () => {
      return {
        ...defaultSettings,
        ...initialSettings
      } as Settings;
    },
    [initialSettings]
  );

  const handleUpdate = useCallback(
    (newSettings: Settings): void => {
      onUpdate({
        colorPreset: settings.colorPreset,
        contrast: settings.contrast,
        direction: settings.direction,
        layout: settings.layout,
        navColor: settings.navColor,
        paletteMode: settings.paletteMode,
        responsiveFontSizes: settings.responsiveFontSizes,
        stretch: settings.stretch,
        ...newSettings
      });
    },
    [onUpdate, settings]
  );

  const handleDrawerOpen = useCallback(
    () => {
      setState((prevState) => ({
        ...prevState,
        openDrawer: true
      }));
    },
    []
  );

  const handleDrawerClose = useCallback(
    () => {
      setState((prevState) => ({
        ...prevState,
        openDrawer: false
      }));
    },
    []
  );

  const isCustom = useMemo(
    () => {
      return !isEqual(
        defaultSettings,
        {
          colorPreset: settings.colorPreset,
          contrast: settings.contrast,
          direction: settings.direction,
          layout: settings.layout,
          navColor: settings.navColor,
          paletteMode: settings.paletteMode,
          responsiveFontSizes: settings.responsiveFontSizes,
          stretch: settings.stretch
        }
      );
    },
    [settings]
  );

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        ...state,
        handleDrawerClose,
        handleDrawerOpen,
        handleReset: onReset,
        handleUpdate,
        isCustom
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const SettingsConsumer = SettingsContext.Consumer;
