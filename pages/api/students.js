export default async function handler(req,res) {


        // getting datas from front end
        const {sh_st,grade,section,sex,limit} = req.body;

        // the api url
        const api = "http://offlix.atwebpages.com/src/b/sh_st.php";
        
        const reData = new URLSearchParams();
        
        reData.append("sh_st", sh_st  ? sh_st : "all");
        reData.append("grade", grade ? grade : "09");
        reData.append("section", section ? section : "B");
        reData.append("sex", sex ? sex : "all");
        reData.append("limit", limit ? limit : 10);

        //changing the url to get api

        const fullAPI = `${api}?${reData}`;

        try{
            const response = await fetch(fullAPI,{
                method:"GET"
            })
            if (response.ok) {
                const finalResponse = await response.json();

                res.status(200).json({
                    status:"success",
                    message:"data recieved successfully",
                    data: finalResponse
                })
            }
        } catch (err) {
            res.status(500).json({
                status:"failed",
                message:"Something Gone Wrong",
                error: err
            })
        }


    }



