- [Getting started](#getting-started)
  - [First step: setup](#first-step-setup)
  - [Second step: add controllers](#second-step-add-controllers)
  - [Thid step: customization](#thid-step-customization)
- [MediaContext](#mediacontext)
    - [mediaElement](#mediaelement)
    - [fps](#fps)
    - [autoBitrateEnabled](#autobitrateenabled)
    - [bitrates](#bitrates)
    - [currentBirateIndex](#currentbirateindex)
    - [currentTime](#currenttime)
    - [duration](#duration)
    - [volume](#volume)
    - [playbackRate](#playbackrate)
    - [paused](#paused)
    - [muted](#muted)
    - [ended](#ended)
    - [buffered](#buffered)
    - [error](#error)
    - [loading](#loading)
    - [rotateDegree](#rotatedegree)
    - [setCurrentBitrateIndex](#setcurrentbitrateindex)
    - [setCurrentTime](#setcurrenttime)
    - [setPlaybackRate](#setplaybackrate)
    - [setVolume](#setvolume)
    - [setPaused](#setpaused)
    - [setMuted](#setmuted)
    - [setRotateDegree](#setrotatedegree)
- [MediaContext consumable ways](#mediacontext-consumable-ways)
    - [Render Prop](#render-prop)
    - [HOC](#hoc)
    - [Custom hook](#custom-hook)
- [ErrorDetails](#errordetails)
## Getting started

Note: MediaProvder must be the wrapper so that all connected components can work in harmony. There must be only one kind of media element rendered inside MediaProvder (Video or Audio components). Under the hood, @axon/next-media leverages the [React Context API]

### First step: setup
Import MediaProvder and related media components in your applcation

```tsx
import { MediaProvider, Video, Audio } from '@axon/next-media'

const VideoPlayer = (
  <MediaProvider mediaSource={videoSource}>
    <Video />
  </MediaProvider>
)

const AudioPlayer = (
  <MediaProvider mediaSource={audioSource}>
    <Audio />
  </MediaProvider>
)
```

### Second step: add controllers
Import related controller commponents into your applcation

```tsx
import {
  MediaProvider,
  Videoe,
  TimeDisplay,
  TogglePlay,
  PlaybackRateModifier,
} from '@axon/next-media'

const VideoPlayer = (
  <MediaProvider mediaSource={videoSource}>
    <Video />

    <!-- Controllers -->
    <TogglePlay />
    <TimeDisplay />
    <PlaybackRateModifier />
  </MediaProvider>
)
```

### Thid step: customization
@axon/next-media place zero constraints on how things work across applications. The volume control, dimensions of media elements and positioning need to be done by consuming applcations

```tsx
const CustomAudioPlayer = (
  <MediaProvider mediaSource={audioSource}>
    <Audio />

    <div className={styles.controlBar}>
      <div className={styles.controlBarLeft}>
        <SingleTimeNavigation value={-5} tooltip={__('Previous 5 seconds ')} />
        <TogglePlay />
        <SingleTimeNavigation value={5} tooltip={__('Next 5 seconds ')} />
        <TimeDisplay />
        <PlaybackRateModifier />
      </div>
      <div className={styles.controlBarCenter} />
      <div className={styles.controlBarRight}>
        <Volume />
      </div>
    </div>

    <Scrubber />
  </MediaProvider>
)
```

## MediaContext

#### mediaElement
(HTMLAudioElement or HTMLVideoElement)

reference to actual media element rendered under MediaProvder

#### fps
(number)

Frame per second of the rendered video. This value fluctuates across video's segments and resolutions

#### autoBitrateEnabled
(boolean)

Indicate whether auto bitrate selection mode is enabled

#### bitrates
(List of BitrateInfo)

interface BitrateInfo {
  bitrate: number,
  width: number,
  height: number,
}

All available bitrates from current streaming service

#### currentBirateIndex
(number)

Indicate currentBirateIndex from the [bitrates](#bitrates)

#### [currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
(number)

Current time of the media element

#### [duration](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration)
(number)

Duration of the media element

#### [volume](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume)
(number)

Volume of the media element

#### [playbackRate](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate)
(number)

PlaybackRate of the media element

#### [paused](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused)
(boolean)

Indicate paused state of the media element

#### [muted](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted)
(boolean)

Indicate muted state of the media element

#### [ended](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended)
(boolean)

Indicate ended state of the media element

#### [buffered](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered)
[TimeRanges](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)

Buffered of the media element

#### error
(value: null | [ErrorDetails](#ErrorDetails))

Media error detail object

#### loading
(boolean)

Indicate whether media has data to play at the current time

#### rotateDegree
(number: 0 | 90 | 180 | 270)

Current rotation degree of the video

#### setCurrentBitrateIndex
(value: number) => void

Set current bitrate index for streaming. The value should be the index of bitrate index in [bitrates](#bitrates). -1 is the special value which is for auto selection mode.

#### setCurrentTime
(value: number) => void

Set current time of the media element


#### setPlaybackRate
(value: number) => void

Note: playbackRate is restrained by specific browser

Set playbackRate of the media element

#### setVolume
(value: number) => void

Note: volume is restrained by specific browser

Set volume of the media element

#### setPaused
(value: boolean) => void

Set paused state of the media element

#### setMuted
(value: boolean) => void

Set muted state of the media element

#### setRotateDegree
(value: number) => void

Set rotation degree of the video

## MediaContext consumable ways
@axon/next-media expose three styles for client applcations to consume mediaContext located inside


#### Render Prop
```tsx
import { MediaConsumer } from '@axon/next-media'

<MediaConsumer render={({ fps }) => <p>FPS: ${fps} </p>} />
```
#### HOC
```tsx
import { withMediaContext } from '@axon/next-media'

const connectedMediaComponent = withMediaContext(Component)
```
#### Custom hook
```tsx
const Component = () => {
  const { autoBitrateEnabled } = useMediaContext()

  return <p>Auto Resolution Selection: ${autoBitrateEnabled ? 'on' : 'off'}
}
```

## ErrorDetails

- type: NETWORK_ERROR | MSE_ERROR

[React Context API]: https://reactjs.org/docs/context.html
[TimeRanges]: https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
