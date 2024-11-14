interface User {
    _id?: string,
    name: string,
    email: string,
    phone: number,
    image: string,
    password: string,
    isBlocked: boolean,
    createdAt: Date
}
export default User