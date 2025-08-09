import Image from "next/image"

const CheckEmail = ()=>{
    return(
        <div className="flex flex-col md:flex-row justify-center items-center h-screen md:gap-40">
            <div>
                <Image 
                src="/emailCheck.png" 
                alt="Check Your Email"
                width={500}
                height={500}
                >
                </Image>
            </div>
            <div className="max-w-sm">
                <h1 className="text-3xl font-bold text-center md:text-left"> Check Your Email </h1>
                <p className="text-neutral-700 mt-4 text-md text-center md:text-left">
                    Please check your email inbox and click on the provided link to verify you email.
                </p>
                <a href="/auth/signin" className="mt-4 block text-neutral-700">
                    <p>
                        <span className="text-xl text-black font-semibold">{"<"}</span> Back to login
                    </p>
                </a>
            </div>
        </div>
    )
}

export default CheckEmail