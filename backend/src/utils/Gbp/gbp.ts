import axios from "axios";

export const getGBPAccounts = async (accessToken: string) => {
  const res = await axios.get(`${process.env.GMB_BASE_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
  return res.data.accounts  
}

export const getGBPLocations = async (accessToken: string, accountId: string) => {
  
  try{
    let readMask = 'name,title,metadata'
  
    const res = await axios.get(
      `${process.env.GMB_INFO_URL}/${accountId}/locations?readMask=${readMask}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    )
 
    return res.data.locations;
  }
   catch(err){
    console.log(err);
     throw err
   }
}

export const getGBPReviews = async (accessToken: string,locationId: string,accountId: string,pageToken?:string) => {
  try{

    const res = await axios.get(
      `${process.env.GMB_REVIEWS_URL}/${accountId}/${locationId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params:{
          pageSize:50,
          ...(pageToken && {pageToken})
        }
      }
    )
    const reviews = res.data.reviews ?? [];
    return {reviews,totalReviews:res.data.totalReviewCount,nextPageToken:res.data.nextPageToken,avgRating:res.data.averageRating};
  }
  catch(err){
    console.log(err)
    throw err
  }
}


export const getGBPlocationDetails= async (accessToken:string,locationId:string,accountId:string)=>{
      try{
        let readMask = 'name,title,storefrontAddress,websiteUri,regularHours,latlng,metadata,categories'
      
        const res = await axios.get(
          `${process.env.GMB_INFO_URL}/${locationId}?readMask=${readMask}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          }
        )
       return {...res.data,accountId};
  }
   catch(err){
    console.log(err);
     throw err
   }
}

const formatTime = (time: { hours: number; minutes?: number }) => {
  const hours = time.hours % 12 || 12
  const minutes = time.minutes ? String(time.minutes).padStart(2, '0') : '00'
  const ampm = time.hours < 12 ? 'AM' : 'PM'
  return `${hours}:${minutes} ${ampm}`
}

export const transformHours = (regularHours: any) => {
  const schedule = regularHours.periods.map((period: any) => ({
    day: period.openDay, 
    opening: formatTime(period.openTime),
    closing: formatTime(period.closeTime),
  }))

  return  schedule 
}