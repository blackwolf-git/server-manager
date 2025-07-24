#!/bin/bash

# 🎨 ألوان للإخراج
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔧 تحديث النظام وتثبيت الأدوات...${NC}"

# تحديث النظام
sudo apt update -y

# تثبيت VirtualBox (اختياري - كأداة بديلة)
if ! command -v virtualbox &>/dev/null; then
    echo -e "${GREEN}⬇️ تثبيت VirtualBox...${NC}"
    sudo apt install virtualbox -y
else
    echo -e "${GREEN}✅ VirtualBox مثبت بالفعل.${NC}"
fi

# تثبيت QEMU لتشغيل Tails من التيرمنال
if ! command -v qemu-system-x86_64 &>/dev/null; then
    echo -e "${GREEN}⬇️ تثبيت QEMU...${NC}"
    sudo apt install qemu-system-x86 -y
else
    echo -e "${GREEN}✅ QEMU مثبت بالفعل.${NC}"
fi

# تنزيل Tails ISO (مرة واحدة فقط)
if [ ! -f "tails.iso" ]; then
    echo -e "${GREEN}⬇️ تحميل Tails ISO...${NC}"
    wget https://tails.net/tails/stable/tails-amd64/latest/tails-amd64-latest.iso -O tails.iso
else
    echo -e "${GREEN}✅ تم العثور على tails.iso محليًا.${NC}"
fi

# تشغيل Tails باستخدام QEMU
echo -e "${GREEN}🚀 تشغيل Tails من خلال QEMU...${NC}"
qemu-system-x86_64 -m 2048 -cdrom tails.iso -boot d -enable-kvm
