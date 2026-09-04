export const platforms={
 youtube:{label:"YouTube Shorts",status:"adapter-ready"},
 tiktok:{label:"TikTok",status:"adapter-ready"},
 instagram:{label:"Instagram Reels",status:"meta-config-required"},
 facebook:{label:"Facebook Reels",status:"meta-config-required"}
};
export async function publishToPlatform(platform,payload){
  if(platform==="instagram"||platform==="facebook")
    throw new Error("Meta credentials, approved permissions, account/Page configuration required");
  throw new Error(`Implement ${platform} adapter in worker`);
}
