
// Q network architecture


// atari example
// -> 84x84x4
// -> 16 8x8 stride 4
// -> 32 4x4 stride 2
// -> fc 256
// -> fc-4 (4 actions)

// current State S = 10x1x10 stack of last 10 orderbooks

// avoid training from batches of consecutive samples
// use experience replay
