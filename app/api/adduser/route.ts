import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index';
import { registerUser } from '@/app/actions/user/action';


export async function POST(req: NextRequest) {

    try {
        const requestBody = await req.json();
        console.log("requestBody", requestBody)

        const { email, name, password, role } = requestBody;

        //validation
        if(!email || !name || !password || !role) {
            console.log("Missing required fields")
            return NextResponse.json(
                { code:400, message: "Missing required fields"},
                { status: 400 }
            );
        }
        console.log('Received data:', email, name, password, role);

        const checkUserExists = await prisma.user.findUnique({where: {email}});

        if(checkUserExists){
            console.log("User already exists")
            return NextResponse.json(
                {code:400, message: "User already exists"},
                {status: 400}
            )
        }
        const newUser = await registerUser(email, name, password, role); 
        console.log("User created successfully:", newUser);

        return NextResponse.json({
            code: 200,
            message: newUser.message,
            user: newUser.user
        })

    } catch (error:any) {
        console.error("Error creating user:", error.message);
        return NextResponse.json(
            {code: 500, message: "Internal server error"},
            {status: 500}
        )
    }
}

