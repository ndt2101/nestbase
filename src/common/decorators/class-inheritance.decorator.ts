export function final(target : Object, key : string | symbol, descriptor : PropertyDescriptor) : void {
    descriptor.writable = false
}
