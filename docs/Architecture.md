
[Original proposal](https://axon.quip.com/ex6ZAuj1LBEg)

# IMPORTANT

Please make sure you get a good grasp of the following technologies before reading the architecture design. Don't jump to the code just yet 😉

[HTMLMEdiaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)

[Hls.js API](https://github.com/video-dev/hls.js/blob/master/docs/API.md)

## Architecture

The core design architecture is very simple:

   - Main components are taking of binding React, MSE and MediaElements
   - Consumable props are exposed for extensibility
   - All action are split into two categories: Media and Streaming. These are taken care of by MediaElement and HLS.js instances accordingly
   - One way direction flow: All update happens via Media and Streaming controllers. Event listeners are registered for updating React's state properly and re-rendering the UI

![New Media Player](https://git.taservs.net/storage/user/456/files/90e43600-9532-11ea-945c-176a4b44861f)

## Code structure

  - [src/constants.ts]
    - Define constants as default behaviors for some connected components
  - [src/index.tsx]
    - Manage module export to consuming packages
  - [src/MediaContext.tsx]
    - MediaContext is responsible for creating the React's Context and provide custom methods for consuming mediaContext
  - [src/MediaProvider.tsx]
    - MediaProvider is responsible for initiate the mediaContext's value and manage update during lifetime of the application. Any properties prefixed with udnerscore "_" are private
  - [src/types.ts]
    - Type definitions
  - [src/utils.ts]
    - Utility functions


[src/types.ts]: ../src/types.ts
[src/utils.ts]: ../src/utils.ts
[src/MediaProvider.tsx]: ../src/MediaProvider.tsx
[src/MediaContext.tsx]: ../src/MediaContext.tsx
[src/constants.ts]: ../src/constants.ts
[src/index.tsx]: ../src/index.tsx
